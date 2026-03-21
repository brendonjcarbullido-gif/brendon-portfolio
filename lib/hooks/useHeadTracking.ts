'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface HeadPosition {
  x: number        // -1 to 1 (left to right)
  y: number        // -1 to 1 (up to down)
  z: number        // 0 to 1 (near to far — face size proxy)
  active: boolean  // true when tracking is working
  source: 'face' | 'gyro' | 'mouse' | 'none'
}

const DEFAULT: HeadPosition = { x: 0, y: 0, z: 0.5, active: false, source: 'none' }

// Smoothing — lerp factor (0 = no movement, 1 = instant snap)
const LERP = 0.08

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function useHeadTracking() {
  const [head, setHead] = useState<HeadPosition>(DEFAULT)
  const currentRef = useRef<HeadPosition>(DEFAULT)
  const rafRef = useRef<number>(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isMobile = useRef(false)

  const targetRef = useRef<HeadPosition>(DEFAULT)

  useEffect(() => {
    const animate = () => {
      const c = currentRef.current
      const t = targetRef.current
      const next: HeadPosition = {
        x: lerp(c.x, t.x, LERP),
        y: lerp(c.y, t.y, LERP),
        z: lerp(c.z, t.z, LERP),
        active: t.active,
        source: t.source,
      }
      currentRef.current = next
      setHead({ ...next })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // ── MOBILE: Gyroscope ──────────────────────────────────
  const initGyro = useCallback(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 45))
      const y = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 20) / 45))
      targetRef.current = { x, y, z: 0.5, active: true, source: 'gyro' }
    }
    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [])

  // ── DESKTOP: Mouse fallback (always available) ─────────
  const initMouse = useCallback(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      targetRef.current = { x, y, z: 0.5, active: true, source: 'mouse' }
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // ── DESKTOP: Face tracking via face-api.js ─────────────
  const initFaceTracking = useCallback(async () => {
    try {
      const faceapi = await import('face-api.js')
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      })
      streamRef.current = stream

      const video = document.createElement('video')
      video.srcObject = stream
      video.autoplay = true
      video.muted = true
      video.playsInline = true
      video.width = 320
      video.height = 240
      video.style.display = 'none'
      document.body.appendChild(video)
      videoRef.current = video

      await new Promise<void>(resolve => {
        video.onloadedmetadata = () => { video.play(); resolve() }
      })

      let running = true
      const detect = async () => {
        if (!running || !videoRef.current) return
        try {
          const result = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 160 }))
            .withFaceLandmarks(true)

          if (result) {
            const { box } = result.detection
            const vw = video.videoWidth || 320
            const vh = video.videoHeight || 240

            const faceCenterX = box.x + box.width / 2
            const x = -((faceCenterX / vw) * 2 - 1) // mirror for natural feel

            const faceCenterY = box.y + box.height / 2
            const y = -((faceCenterY / vh) * 2 - 1)

            const faceWidthRatio = box.width / vw
            const z = Math.max(0, Math.min(1, 1 - (faceWidthRatio - 0.15) / 0.5))

            targetRef.current = { x, y, z, active: true, source: 'face' }
          }
        } catch {
          /* silent fail on single frame */
        }

        if (running) setTimeout(detect, 80) // ~12fps
      }

      detect()

      return () => {
        running = false
        stream.getTracks().forEach(t => t.stop())
        video.remove()
      }
    } catch (err) {
      console.warn('[HeadTracking] Camera unavailable, falling back to mouse', err)
      return initMouse()
    }
  }, [initMouse])

  // ── INIT ───────────────────────────────────────────────
  useEffect(() => {
    isMobile.current = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

    let cleanup: (() => void) | undefined

    if (isMobile.current) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const onTouch = async () => {
          try {
            const perm = await (DeviceOrientationEvent as any).requestPermission()
            if (perm === 'granted') cleanup = initGyro()
          } catch {
            cleanup = initMouse()
          }
          window.removeEventListener('touchstart', onTouch)
        }
        window.addEventListener('touchstart', onTouch, { once: true })
      } else {
        cleanup = initGyro()
      }
    } else {
      cleanup = initMouse()
      initFaceTracking().then(faceCleanup => {
        if (faceCleanup) {
          const oldCleanup = cleanup
          cleanup = () => { oldCleanup?.(); faceCleanup?.() }
        }
      })
    }

    return () => cleanup?.()
  }, [initGyro, initMouse, initFaceTracking])

  return head
}
