import {getEnv} from '@sica/lib/env'

export const projectId = getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'qht5ld5w')
export const dataset = getEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
export const apiVersion = getEnv('NEXT_PUBLIC_SANITY_API_VERSION', '2025-07-31')
export const siteUrl = getEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
