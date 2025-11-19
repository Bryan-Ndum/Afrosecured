/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
    },
  },
}

export default nextConfig
