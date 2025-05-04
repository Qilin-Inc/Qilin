/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['stripe.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone"
}
export default nextConfig;