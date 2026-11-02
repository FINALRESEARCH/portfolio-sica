import Link from 'next/link'
import type {ProjectIndexItem, SiteSettings} from '@/lib/types'
import {DEFAULT_SITE_SETTINGS} from '@/lib/defaults'
import {FinalResearchCredit} from './final-research-credit'

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

  // svh, not dvh: Chrome on iOS resolves dvh on first load as if its bottom
  // toolbar weren't there, which pushed this peek below the fold.
  return (
    <Tag id={id} className="relative inset-x-0 top-[16.5svh] flex h-auto flex-wrap items-stretch justify-between pb-4 cursor-crosshair max-[480px]:pb-2">
      {details}
      <div className="flex max-w-[45vw] flex-col gap-32 pl-4 max-[480px]:max-w-[50vw] max-[480px]:pl-2">
        <div className="flex flex-col">
          <div className="mb-2 uppercase">
            <Link
              href="/"
              aria-current={homeCurrent ? 'page' : undefined}
              className="inline-block transition-opacity duration-300 hover:opacity-30"
            >
              <span className="block text-[4rem] leading-4 max-[768px]:text-[3rem] max-[480px]:text-[1.7rem] max-[480px]:leading-[1.2rem]">
                {s.brandName}
              </span>
            </Link>
          </div>
          <div className="opacity-30">{s.bio}</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="mb-2 uppercase">
            <span className="block text-[2rem] max-[768px]:leading-6 max-[480px]:text-[1.4rem]">
              Contact
            </span>
          </div>
          <div className="flex flex-col items-start gap-1 opacity-30 max-[480px]:gap-0">
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
        <div className="flex flex-col opacity-30 text-base leading-[1.3rem] max-[768px]:text-[1.5rem] max-[768px]:leading-[1.7rem] max-[480px]:text-[16px] max-[480px]:leading-[19px]">
          <div>
            ©{new Date().getFullYear()} {s.copyright}
          </div>
          <FinalResearchCredit />
        </div>
      </div>
      <div className="flex max-w-[45vw] flex-col items-end gap-1 pr-4 max-[480px]:gap-[2px] max-[480px]:pr-2">
        <div className="flex flex-col items-end">
          <div className="mb-2 flex justify-end uppercase">
            <span className="block text-[2rem] max-[768px]:leading-6 max-[480px]:text-[1.4rem] max-[480px]:leading-[18px]">
              Index
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 text-right max-[480px]:gap-[2px]">
            {projects?.map((project) =>
              project.slug ? (
                <Link
                  key={project._id}
                  href={`/project/${project.slug}`}
                  className="cursor-pointer transition-opacity duration-300 hover:opacity-30"
                >
                  {project.title}
                </Link>
              ) : null,
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 max-[480px]:gap-[2px]">
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
