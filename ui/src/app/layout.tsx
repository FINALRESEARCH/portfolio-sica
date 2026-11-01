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

// Mark fade-in images as loaded before React hydrates, so slow connections
// don't keep a downloaded image hidden behind its blur (see FadeImage).
const IMAGE_LOADED_SCRIPT = `document.addEventListener('load',function(e){var t=e.target;if(t.tagName==='IMG'&&t.hasAttribute('data-fade'))t.setAttribute('data-loaded','')},true)`

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
      <head>
        <script dangerouslySetInnerHTML={{__html: IMAGE_LOADED_SCRIPT}} />
      </head>
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  )
}
