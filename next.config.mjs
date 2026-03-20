/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@mediapipe/face_mesh', '@mediapipe/camera_utils'],
}
export default nextConfig
