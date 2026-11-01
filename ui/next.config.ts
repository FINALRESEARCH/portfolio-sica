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
  async redirects() {
    return [{source: '/projects/:slug', destination: '/project/:slug', permanent: true}]
  },
}

export default nextConfig
