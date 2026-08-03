import Link from 'next/link'
import type {ProjectIndexItem, SiteSettings} from '@/lib/types'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'

type SiteNavProps = {
  settings?: SiteSettings | null
  projects?: ProjectIndexItem[] | null
  homeCurrent?: boolean
  ssenseCurrent?: boolean
  moreCurrent?: boolean
  details?: React.ReactNode
  id?: string
  asNav?: boolean
}

export function SiteNav({
  settings,
  projects = [],
  homeCurrent,
  ssenseCurrent,
  moreCurrent,
  details,
  id,
  asNav,
}: SiteNavProps) {
  const s = {...DEFAULT_SITE_SETTINGS, ...settings}
  const Tag = asNav ? 'nav' : 'div'

  return (
    <Tag id={id} className="relative inset-x-0 top-[16.5dvh] flex h-auto flex-wrap items-stretch justify-between pb-4 cursor-crosshair">
      {details}
      <div className="flex max-w-[45vw] flex-col gap-32 pl-4 max-[767px]:gap-16 max-[479px]:max-w-none max-[479px]:gap-8">
        <div className="flex flex-col">
          <div className="mb-2 uppercase">
            <Link
              href="/"
              aria-current={homeCurrent ? 'page' : undefined}
              className="inline-block transition-opacity duration-300 hover:opacity-30"
            >
              <span className="text-[3rem] font-medium leading-none md:text-[4rem] md:leading-4">
                {s.brandName}
              </span>
            </Link>
          </div>
          <div className="opacity-30">{s.bio}</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="mb-2 uppercase">
            <span className="text-[2rem]">Contact</span>
          </div>
          <div className="flex flex-col items-start gap-1 opacity-30">
            <a href={`mailto:${s.email}`} className="transition-opacity duration-300 hover:opacity-100">
              Email
            </a>
            <a
              href={s.instagramUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-300 hover:opacity-100"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="flex flex-col opacity-30">
          <div className="text-base leading-[1.3rem]">{s.copyright}</div>
          <div className="text-base leading-[1.3rem]">
            Website by{' '}
            <a
              href={s.designerCredit?.url || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-300 hover:opacity-100"
            >
              {s.designerCredit?.label}
            </a>
          </div>
        </div>
      </div>
      <div className="flex max-w-[45vw] flex-col items-end gap-1 pr-4 max-[479px]:max-w-none">
        <div className="flex flex-col items-end">
          <div className="mb-2 flex justify-end uppercase">
            <span className="text-[2rem]">Index</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            {projects?.map((project) =>
              project.slug ? (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug}`}
                  className="cursor-pointer transition-opacity duration-300 hover:opacity-30"
                >
                  {project.title}
                </Link>
              ) : null,
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Link
            href="/ssense"
            aria-current={ssenseCurrent ? 'page' : undefined}
            className="transition-opacity duration-300 hover:opacity-30"
          >
            SSENSE
          </Link>
          <Link
            href="/more"
            aria-current={moreCurrent ? 'page' : undefined}
            className="transition-opacity duration-300 hover:opacity-30"
          >
            More
          </Link>
        </div>
      </div>
    </Tag>
  )
}
