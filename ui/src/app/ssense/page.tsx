import type {Metadata} from 'next'
import {MiscGallery} from '@/components/misc-gallery'
import {ScrollJumpButtons} from '@/components/scroll-jump-buttons'
import {SiteNav} from '@/components/site-nav'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'
import {socialMetadata} from '@/lib/site-metadata'
import type {MiscItem, ProjectIndexItem, SiteSettings} from '@/lib/types'
import {sanityFetch} from '@/sanity/lib/live'
import {
  PROJECTS_INDEX_QUERY,
  SITE_SETTINGS_QUERY,
  SSENSE_ITEMS_QUERY,
} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    stega: false,
  })
  const settings = (data || DEFAULT_SITE_SETTINGS) as SiteSettings
  const intro = settings.ssenseIntro || DEFAULT_SITE_SETTINGS.ssenseIntro

  return socialMetadata({
    title: intro.title || 'SSENSE',
    description:
      intro.description ||
      'E-Commerce Styling by Sica Thai for SSENSE.',
    image: settings.defaultOgImage,
    path: '/ssense',
  })
}

export default async function SsensePage() {
  const [{data: settings}, {data: projects}, {data: items}] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY}),
    sanityFetch({query: PROJECTS_INDEX_QUERY}),
    sanityFetch({query: SSENSE_ITEMS_QUERY}),
  ])

  const siteSettings = (settings || DEFAULT_SITE_SETTINGS) as SiteSettings
  const intro = siteSettings.ssenseIntro || DEFAULT_SITE_SETTINGS.ssenseIntro

  const details = (
    <div className="mb-12 flex w-full flex-col border-b border-black/10">
      <div className="mb-12 flex w-full flex-col justify-between gap-4 px-4">
        <div className="flex justify-between">
          <div>{intro.title}</div>
        </div>
        <div className="max-w-[60vw] max-[479px]:max-w-none">
          <p className="mb-1">{intro.description}</p>
        </div>
      </div>
    </div>
  )

  return (
    <main className="relative min-h-dvh pb-16">
      <div id="top" />
      <MiscGallery
        items={(items || []) as MiscItem[]}
        emptyLabel="Add SSENSE images in Sanity Studio."
      />
      <ScrollJumpButtons />
      <SiteNav
        id="nav"
        asNav
        settings={siteSettings}
        projects={(projects || []) as ProjectIndexItem[]}
        ssenseCurrent
        details={details}
      />
    </main>
  )
}
