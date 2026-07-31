import type {Metadata} from 'next'
import {HomeSlider} from '@/components/home-slider'
import {SiteNav} from '@/components/site-nav'
import {UiGuide} from '@/components/ui-guide'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'
import type {ProjectIndexItem, SiteSettings} from '@/lib/types'
import {sanityFetch} from '@/sanity/lib/live'
import {PROJECTS_INDEX_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY})
  const settings = (data || DEFAULT_SITE_SETTINGS) as SiteSettings
  const title = settings.siteTitle || 'SICA THAI'
  const description =
    settings.seoDescription || DEFAULT_SITE_SETTINGS.seoDescription

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{url: '/images/OPENGRAPH-IMG.png'}],
    },
    twitter: {
      title,
      description,
      images: ['/images/OPENGRAPH-IMG.png'],
    },
    alternates: {canonical: '/'},
  }
}

export default async function HomePage() {
  const [{data: settings}, {data: projects}] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY}),
    sanityFetch({query: PROJECTS_INDEX_QUERY}),
  ])

  const siteSettings = (settings || DEFAULT_SITE_SETTINGS) as SiteSettings
  const projectList = (projects || []) as ProjectIndexItem[]

  return (
    <main className="relative min-h-dvh">
      <div className="relative">
        <HomeSlider projects={projectList} />
        <UiGuide />
      </div>
      <SiteNav settings={siteSettings} projects={projectList} homeCurrent />
    </main>
  )
}
