import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {SanityLive} from '@/sanity/lib/live'
import {siteUrl} from '@/sanity/env'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SICA THAI',
    template: '%s',
  },
  description:
    'Sica Thai — stylist and wardrobe consultant. Selected projects, SSENSE, and more.',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
  openGraph: {
    title: 'SICA THAI',
    images: [{url: '/images/OPENGRAPH-IMG.png'}],
  },
  twitter: {
    title: 'SICA THAI',
    images: ['/images/OPENGRAPH-IMG.png'],
  },
}

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  )
}
