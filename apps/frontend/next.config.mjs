/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['stripe.com'],
    remotePatterns: [{
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/haxgun/**',
    }]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone"
}
export default nextConfig;