'use client'

import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import {FadeImage} from './fade-image'
import type {ProjectIndexItem} from '@/lib/types'

type HomeSliderProps = {
  projects: ProjectIndexItem[]
}

export function HomeSlider({projects}: HomeSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 0,
    align: 'start',
  })

  if (!projects.length) {
    return (
      <div className="relative flex h-[80dvh] max-h-[80dvh] items-center justify-center px-4 text-center opacity-30">
        Add projects in Sanity Studio to populate the home slider.
      </div>
    )
  }

  return (
    <div className="relative h-[80dvh] max-h-[80dvh]">
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {projects.map((project) => (
            <div key={project._id} className="relative min-w-0 flex-[0_0_100%] h-full">
              {project.slug ? (
                <Link
                  href={`/projects/${project.slug}`}
                  className="relative flex h-full w-full items-start justify-center"
                >
                  <div className="relative h-full w-full">
                    <FadeImage
                      image={project.coverImage}
                      alt={project.title || ''}
                      fill
                      priority
                      sizes="100vw"
                      className="!absolute"
                    />
                  </div>
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Previous project"
        className="absolute inset-y-0 left-0 z-[1] flex w-[28vw] cursor-w-resize items-center justify-center border-0 bg-transparent max-[767px]:w-[20vw]"
        onClick={() => emblaApi?.scrollPrev()}
      />
      <button
        type="button"
        aria-label="Next project"
        className="absolute inset-y-0 right-0 z-[1] flex w-[28vw] cursor-e-resize items-center justify-center border-0 bg-transparent max-[767px]:w-[20vw]"
        onClick={() => emblaApi?.scrollNext()}
      />
    </div>
  )
}
