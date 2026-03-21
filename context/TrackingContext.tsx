'use client'

import {
  createContext, useContext, useEffect, useRef, useState, useCallback
} from 'react'

export interface TrackPos {
  x: number   // -1 (left) to 1 (right)
  y: number   // -1 (up)   to 1 (down)
  z: number   // 0 (close) to 1 (far)
  source: 'mouse' | 'face' | 'gyro' | 'idle'
}

const DEFAULT: TrackPos = { x: 0, y: 0, z: 0.5, source: 'idle' }

const TrackingContext = createContext<TrackPos>(DEFAULT)

export function useTracking() {
  return useContext(TrackingContext)
}

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = useState<TrackPos>(DEFAULT)

  // Raw target — updated by whichever source is active
  const target = useRef<TrackPos>(DEFAULT)
  // Smoothed current — lerped toward target each frame
  const current = useRef<TrackPos>(DEFAULT)
  const rafId = useRef<number>()

  // ── LERP LOOP — runs always ──────────────────────────
  useEffect(() => {
    const LERP = 0.06  // 0 = frozen, 1 = instant. 0.06 = smooth drift

    const tick = () => {
      const t = target.current
      const c = current.current
      const lerp = (a: number, b: number) => a + (b - a) * LERP

      const next: TrackPos = {
        x: lerp(c.x, t.x),
        y: lerp(c.y, t.y),
        z: lerp(c.z, t.z),
        source: t.source,
      }

      // Only re-render if moved meaningfully (perf optimization)
      if (
        Math.abs(next.x - c.x) > 0.0005 ||
        Math.abs(next.y - c.y) > 0.0005 ||
        Math.abs(next.z - c.z) > 0.0005
      ) {
        current.current = next
        setPos({ ...next })
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [])

  // ── SOURCE 1: MOUSE (desktop, instant, no permission) ─
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isMobile) return

    const onMove = (e: MouseEvent) => {
      // Only update if face tracking isn't active
      if (target.current.source === 'face') return
      target.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y:  (e.clientY / window.innerHeight) * 2 - 1,
        z: 0.5,
        source: 'mouse',
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── SOURCE 2: GYROSCOPE (mobile) ──────────────────────
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (!isMobile) return

    const startGyro = () => {
      const onOrient = (e: DeviceOrientationEvent) => {
        // gamma = left/right tilt (-90 to 90)
        // beta  = forward/back tilt (-180 to 180)
        // Normalize to -1 / 1, clamp, invert X for natural feel
        const x = Math.max(-1, Math.min(1, -(e.gamma ?? 0) / 35))
        const y = Math.max(-1, Math.min(1,  ((e.beta  ?? 0) - 15) / 35))
        target.current = { x, y, z: 0.5, source: 'gyro' }
      }
      window.addEventListener('deviceorientation', onOrient, { passive: true })
      return () => window.removeEventListener('deviceorientation', onOrient)
    }

    let cleanup: (() => void) | undefined

    // iOS 13+ requires explicit permission request on user gesture
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      const onTouch = async () => {
        try {
          const result = await (DeviceOrientationEvent as any).requestPermission()
          if (result === 'granted') cleanup = startGyro()
        } catch {
          // permission denied or unavailable — stay on idle
        }
      }
      window.addEventListener('touchstart', onTouch, { once: true, passive: true })
      return () => {
        window.removeEventListener('touchstart', onTouch)
        cleanup?.()
      }
    } else {
      // Android — no permission needed
      cleanup = startGyro()
      return cleanup
    }
  }, [])

  // ── SOURCE 3: FACE TRACKING (desktop, async upgrade) ──
  const initFace = useCallback(async () => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isMobile) return

    try {
      // Dynamic import — prevents SSR crash
      const faceapi = await import('face-api.js')

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
      ])

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      })

      const video = document.createElement('video')
      video.srcObject = stream
      video.autoplay = true
      video.muted = true
      video.playsInline = true
      video.width = 320
      video.height = 240
      video.style.cssText = 'position:fixed;opacity:0;pointer-events:none;z-index:-1'
      document.body.appendChild(video)

      await new Promise<void>(res => {
        video.onloadedmetadata = () => { video.play().then(res) }
      })

      let running = true

      const detect = async () => {
        if (!running) return
        try {
          const det = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.4 }))
            .withFaceLandmarks(true)

          if (det) {
            const { box } = det.detection
            const vw = video.videoWidth  || 320
            const vh = video.videoHeight || 240

            const x = -(((box.x + box.width  / 2) / vw) * 2 - 1)
            const y = -(((box.y + box.height / 2) / vh) * 2 - 1)
            const faceRatio = box.width / vw
            const z = Math.max(0, Math.min(1, 1 - (faceRatio - 0.1) / 0.55))

            target.current = { x, y, z, source: 'face' }
          } else {
            // No face detected — fade back toward center slowly
            target.current = {
              ...target.current,
              x: target.current.x * 0.95,
              y: target.current.y * 0.95,
              source: 'face',
            }
          }
        } catch { /* single frame error — continue */ }

        if (running) setTimeout(detect, 85) // ~12fps
      }

      detect()

      return () => {
        running = false
        stream.getTracks().forEach(t => t.stop())
        video.remove()
      }

    } catch (err) {
      // Camera denied or face-api load failed — mouse fallback already running
      console.info('[Tracking] Face tracking unavailable:', err)
    }
  }, [])

  useEffect(() => {
    let cleanup: (() => void) | undefined | void
    initFace().then(c => { cleanup = c })
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, [initFace])

  return (
    <TrackingContext.Provider value={pos}>
      {children}
    </TrackingContext.Provider>
  )
}
