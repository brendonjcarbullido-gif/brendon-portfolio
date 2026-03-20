'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export type ParallaxOffset = { x: number; y: number }

type FaceMeshLike = {
  setOptions: (o: {
    maxNumFaces?: number
    refineLandmarks?: boolean
    minDetectionConfidence?: number
    minTrackingConfidence?: number
  }) => void
  onResults: (
    cb: (results: {
      multiFaceLandmarks?: Array<Array<{ x: number; y: number; z: number }>>
    }) => void
  ) => void
  send: (inputs: { image: HTMLVideoElement }) => Promise<void>
}

type FaceMeshCtor = new (config: { locateFile?: (file: string) => string }) => FaceMeshLike

type CameraLike = { start: () => Promise<void>; stop: () => void }

type CameraCtor = new (
  video: HTMLVideoElement,
  options: { onFrame: () => Promise<void> | void; width: number; height: number }
) => CameraLike

function resolveFaceMeshCtor(mod: Record<string, unknown>): FaceMeshCtor {
  if (typeof mod.FaceMesh === 'function') return mod.FaceMesh as FaceMeshCtor
  if (typeof mod.default === 'function') return mod.default as FaceMeshCtor
  throw new Error('FaceMesh export not found')
}

function resolveCameraCtor(mod: Record<string, unknown>): CameraCtor {
  if (typeof mod.Camera === 'function') return mod.Camera as CameraCtor
  if (typeof mod.default === 'function') return mod.default as CameraCtor
  throw new Error('Camera export not found')
}

/**
 * Head tracking via MediaPipe Face Mesh (nose tip landmark index 1).
 * Falls back to mouse position if camera is denied or FaceMesh fails.
 * Updates `parallaxRef` every frame (for Hero rAF transforms — not React state).
 */
export function useHeadTracking(enabled: boolean) {
  const parallaxRef = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const targetRef = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const smoothedRef = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const [isTracking, setIsTracking] = useState(false)

  const modeRef = useRef<'face' | 'mouse'>('mouse')
  const rafIdRef = useRef(0)

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (modeRef.current !== 'mouse') return
    targetRef.current = {
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      modeRef.current = 'mouse'
      parallaxRef.current = { x: 0, y: 0 }
      setIsTracking(false)
      return
    }

    let cancelled = false
    let cameraInstance: CameraLike | null = null
    const videoEl = document.createElement('video')
    videoEl.setAttribute('playsinline', '')
    videoEl.setAttribute('muted', '')
    videoEl.muted = true
    videoEl.style.cssText =
      'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;'
    document.body.appendChild(videoEl)

    const startMouse = () => {
      modeRef.current = 'mouse'
      setIsTracking(false)
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    const stopRaf = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = 0
    }

    const startRaf = () => {
      stopRaf()
      const tick = () => {
        const s = smoothedRef.current
        const t = targetRef.current
        const factor = 0.08
        s.x = lerp(s.x, t.x, factor)
        s.y = lerp(s.y, t.y, factor)
        parallaxRef.current = { x: s.x, y: s.y }
        rafIdRef.current = requestAnimationFrame(tick)
      }
      rafIdRef.current = requestAnimationFrame(tick)
    }

    const boot = async () => {
      try {
        const [faceMeshMod, cameraMod] = await Promise.all([
          import('@mediapipe/face_mesh'),
          import('@mediapipe/camera_utils'),
        ])
        if (cancelled) return

        const FaceMeshClass = resolveFaceMeshCtor(faceMeshMod as Record<string, unknown>)
        const CameraClass = resolveCameraCtor(cameraMod as Record<string, unknown>)

        const faceMesh = new FaceMeshClass({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        })

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        faceMesh.onResults((results) => {
          if (modeRef.current !== 'face') return
          const lm = results.multiFaceLandmarks?.[0]?.[1]
          if (!lm) return
          targetRef.current = {
            x: -(lm.x - 0.5),
            y: lm.y - 0.5,
          }
        })

        const camera = new CameraClass(videoEl, {
          onFrame: async () => {
            if (modeRef.current !== 'face') return
            await faceMesh.send({ image: videoEl })
          },
          width: 640,
          height: 480,
        })
        cameraInstance = camera

        modeRef.current = 'face'
        setIsTracking(true)
        startRaf()
        await camera.start()
      } catch {
        if (cancelled) return
        startMouse()
        startRaf()
      }
    }

    void boot()

    return () => {
      cancelled = true
      stopRaf()
      window.removeEventListener('mousemove', onMouseMove)
      try {
        cameraInstance?.stop?.()
      } catch {
        /* ignore */
      }
      if (videoEl.parentNode) videoEl.parentNode.removeChild(videoEl)
      modeRef.current = 'mouse'
      setIsTracking(false)
    }
  }, [enabled, onMouseMove])

  return { parallaxRef, isTracking }
}
