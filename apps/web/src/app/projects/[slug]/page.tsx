import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ProjectPageClient} from '@/components/project-page-client'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'
import type {Project, ProjectIndexItem, SiteSettings} from '@/lib/types'
import {urlForImage} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  PROJECTS_INDEX_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries'
import {client} from '@/sanity/lib/client'

export const dynamicParams = true

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
  const {data} = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: {slug},
  })
  const project = data as Project | null
  if (!project) return {title: 'SICA THAI'}

  const title = project.seo?.title || `SICA THAI — ${project.title || ''}`
  const description = project.seo?.description || undefined
  const ogSource = project.seo?.ogImage || project.coverImage
  const ogImage = ogSource?.asset
    ? urlForImage(ogSource).width(1200).height(630).fit('crop').url()
    : '/images/OPENGRAPH-IMG.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{url: ogImage}],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
  }
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
