/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['stripe.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
}
export default nextConfig;