import type {Metadata} from 'next'
import {MiscGallery} from '@/components/misc-gallery'
import {ScrollJumpButtons} from '@/components/scroll-jump-buttons'
import {SiteNav} from '@/components/site-nav'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'
import {socialMetadata} from '@/lib/site-metadata'
import type {MiscItem, ProjectIndexItem, SiteSettings} from '@/lib/types'
import {sanityFetch} from '@/sanity/lib/live'
import {
  MORE_ITEMS_QUERY,
  PROJECTS_INDEX_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    stega: false,
  })
  const settings = (data || DEFAULT_SITE_SETTINGS) as SiteSettings

  return socialMetadata({
    title: 'SICA THAI — More',
    description: 'More work by Sica Thai.',
    image: settings.defaultOgImage,
    path: '/more',
  })
}

export default async function MorePage() {
  const [{data: settings}, {data: projects}, {data: items}] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY}),
    sanityFetch({query: PROJECTS_INDEX_QUERY}),
    sanityFetch({query: MORE_ITEMS_QUERY}),
  ])

  return (
    <main className="relative min-h-dvh pb-16">
      <div id="top" />
      <MiscGallery
        items={(items || []) as MiscItem[]}
        emptyLabel="Add More images in Sanity Studio."
      />
      <ScrollJumpButtons />
      <SiteNav
        id="nav"
        asNav
        settings={(settings || DEFAULT_SITE_SETTINGS) as SiteSettings}
        projects={(projects || []) as ProjectIndexItem[]}
        moreCurrent
      />
    </main>
  )
}
