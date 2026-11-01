import type {Metadata} from 'next'
import {HomeSlider} from '@/components/home-slider'
import {SiteNav} from '@/components/site-nav'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'
import {SITE_NAME, socialMetadata} from '@/lib/site-metadata'
import type {ProjectIndexItem, SiteSettings} from '@/lib/types'
import {sanityFetch} from '@/sanity/lib/live'
import {PROJECTS_INDEX_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    stega: false,
  })
  const settings = (data || DEFAULT_SITE_SETTINGS) as SiteSettings

  return socialMetadata({
    title: settings.siteTitle || SITE_NAME,
    description:
      settings.seoDescription || DEFAULT_SITE_SETTINGS.seoDescription,
    image: settings.defaultOgImage,
    path: '/',
  })
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
      {/* Webflow sets cursor:default on the home body at ≤479 only */}
      <div className="relative max-[480px]:cursor-default">
        <HomeSlider projects={projectList} />
      </div>
      <SiteNav settings={siteSettings} projects={projectList} homeCurrent />
    </main>
  )
}
