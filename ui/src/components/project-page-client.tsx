'use client'

import {useCallback, useState} from 'react'
import {ProjectSlider} from './project-slider'
import {BtsModal} from './bts-modal'
import {PageTransition} from './page-transition'
import {PortableText} from './portable-text'
import {SiteNav} from './site-nav'
import {splitProjectImages} from '@/lib/gallery'
import type {Project, ProjectIndexItem, SiteSettings} from '@/lib/types'

type ProjectPageClientProps = {
  project: Project
  settings?: SiteSettings | null
  projects?: ProjectIndexItem[] | null
}

export function ProjectPageClient({project, settings, projects}: ProjectPageClientProps) {
  const [index, setIndex] = useState(0)
  const [btsOpen, setBtsOpen] = useState(false)
  const {gallery, btsImages} = splitProjectImages(project.gallery, project.btsImages)
  const total = gallery.length || 1
  const hasBts = btsImages.length > 0

  const onIndexChange = useCallback((next: number) => {
    setIndex(next)
  }, [])

  const details = (
    <div className="mb-12 flex w-full flex-col border-b border-black/10">
      <div className="mb-12 flex w-full flex-col justify-between gap-4 px-4">
        <div className="relative flex justify-between">
          <div>{project.title}</div>
          <div className="absolute left-[47.5%] right-[47.5%] w-[5%] text-center max-[991px]:static max-[991px]:w-auto max-[991px]:text-left">
            {index + 1} / {total}
          </div>
          {hasBts ? (
            <button
              type="button"
              onClick={() => setBtsOpen(true)}
              className="opacity-30 transition-opacity duration-300 hover:opacity-100"
            >
              BTS
            </button>
          ) : (
            <span />
          )}
        </div>
        <div className="max-w-[60vw] max-[479px]:max-w-none">
          <PortableText value={project.description} />
        </div>
      </div>
      <div className="mb-12 flex w-full flex-col justify-between gap-4 px-4">
        <div className="flex justify-between">
          <div>Credits</div>
        </div>
        <div className="max-w-[60vw] max-[479px]:max-w-none">
          <PortableText value={project.credits} />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <PageTransition image={gallery[0] || project.coverImage} />
      <ProjectSlider images={gallery} onIndexChange={onIndexChange} />
      <SiteNav settings={settings} projects={projects} details={details} />
      <BtsModal
        open={btsOpen}
        onClose={() => setBtsOpen(false)}
        title={project.title}
        images={btsImages}
      />
    </>
  )
}
