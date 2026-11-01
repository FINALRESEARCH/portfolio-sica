import {getEnv} from '@sica/lib/env'

export const projectId = getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'fdog0g13')
export const dataset = getEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
export const apiVersion = getEnv('NEXT_PUBLIC_SANITY_API_VERSION', '2025-07-31')
export const siteUrl = getEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')

/** Only the real domain may be indexed; previews and local dev are noindex. */
export const isIndexable = /^https:\/\/(www\.)?sicathai\.com\/?$/.test(siteUrl)
