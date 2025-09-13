import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        exclude: ['*.anchor'],
      },
    },
  },
}

export default nextConfig
