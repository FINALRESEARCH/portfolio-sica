import type {MetadataRoute} from 'next'
import {siteUrl} from '@/sanity/env'
import {client} from '@/sanity/lib/client'
import {SITEMAP_QUERY} from '@/sanity/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: Array<{slug: string; _updatedAt?: string}> = []
  try {
    const data = await client.fetch(SITEMAP_QUERY)
    projects = (data?.projects || []) as Array<{slug: string; _updatedAt?: string}>
  } catch {
    projects = []
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/ssense`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/more`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/project/${project.slug}`,
      lastModified: project._updatedAt ? new Date(project._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
