import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@sica/ui', '@sica/lib'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
