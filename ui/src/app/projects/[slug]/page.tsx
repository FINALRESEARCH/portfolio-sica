import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ProjectPageClient} from '@/components/project-page-client'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'
import {SITE_NAME, socialMetadata} from '@/lib/site-metadata'
import type {Project, ProjectIndexItem, SiteSettings} from '@/lib/types'
import {sanityFetch} from '@/sanity/lib/live'
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  PROJECTS_INDEX_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries'
import {client} from '@/sanity/lib/client'

export const dynamicParams = true
export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  try {
    const projects = await client.fetch(PROJECT_SLUGS_QUERY)
    return (projects || [])
      .filter((project: {slug?: string | null}) => Boolean(project.slug))
      .map((project: {slug: string}) => ({slug: project.slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const [{data: projectData}, {data: settingsData}] = await Promise.all([
    sanityFetch({
      query: PROJECT_BY_SLUG_QUERY,
      params: {slug},
      stega: false,
    }),
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      stega: false,
    }),
  ])
  const project = projectData as Project | null
  if (!project) return {title: SITE_NAME}

  const settings = (settingsData || DEFAULT_SITE_SETTINGS) as SiteSettings
  const title = project.seo?.title || `${SITE_NAME} — ${project.title || ''}`

  return socialMetadata({
    title,
    description: project.seo?.description || settings.seoDescription,
    image:
      project.seo?.ogImage ||
      project.coverImage ||
      settings.defaultOgImage,
    path: `/projects/${slug}`,
  })
}

export default async function ProjectPage({params}: PageProps) {
  const {slug} = await params
  const [{data: project}, {data: settings}, {data: projects}] = await Promise.all([
    sanityFetch({query: PROJECT_BY_SLUG_QUERY, params: {slug}}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
    sanityFetch({query: PROJECTS_INDEX_QUERY}),
  ])

  if (!project) notFound()

  return (
    <main className="relative min-h-dvh">
      <ProjectPageClient
        project={project as Project}
        settings={(settings || DEFAULT_SITE_SETTINGS) as SiteSettings}
        projects={(projects || []) as ProjectIndexItem[]}
      />
    </main>
  )
}
