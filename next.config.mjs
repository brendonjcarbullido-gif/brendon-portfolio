/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@mediapipe/face_mesh', '@mediapipe/camera_utils'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'canvas',
        'face-api.js',
      ]
    }
    return config
  },
}
export default nextConfig
