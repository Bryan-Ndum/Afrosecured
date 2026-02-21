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
  webpack: (config, { isServer }) => {
    // Optimize webpack cache to avoid "Serializing big strings" warnings
    config.cache = {
      type: 'filesystem',
      compression: 'gzip',
      maxMemoryGenerations: 1,
    }
    return config
  },
  experimental: {
    // Only include necessary files for specific routes that need them
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild',
        'node_modules/webpack',
        'node_modules/rollup',
        'node_modules/terser',
      ],
    },
  },
}

export default nextConfig
