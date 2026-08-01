import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {SanityLive} from '@/sanity/lib/live'
import {siteUrl} from '@/sanity/env'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
} from '@/lib/site-metadata'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: '%s',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  // Favicon + Apple touch icon come from app/icon.png and app/apple-icon.png
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
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
