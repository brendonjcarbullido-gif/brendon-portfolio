declare module '@mediapipe/face_mesh' {
  export class FaceMesh {
    constructor(config: { locateFile?: (file: string) => string })
    setOptions(options: {
      maxNumFaces?: number
      refineLandmarks?: boolean
      minDetectionConfidence?: number
      minTrackingConfidence?: number
    }): void
    onResults(
      cb: (results: {
        multiFaceLandmarks?: Array<Array<{ x: number; y: number; z: number }>>
      }) => void
    ): void
    close?(): void
    send(inputs: { image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement }): Promise<void>
  }
}

declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(
      video: HTMLVideoElement,
      options: { onFrame: () => Promise<void> | void; width: number; height: number }
    )
    start(): Promise<void>
    stop(): void
  }
}
