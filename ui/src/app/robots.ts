import type {MetadataRoute} from 'next'
import {isIndexable, siteUrl} from '@/sanity/env'

export default function robots(): MetadataRoute.Robots {
  // Previews (e.g. *.vercel.app) must not compete with the live domain in search.
  if (!isIndexable) return {rules: {userAgent: '*', disallow: '/'}}
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
