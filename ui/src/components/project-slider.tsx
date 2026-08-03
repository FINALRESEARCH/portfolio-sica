'use client'

import {useCallback, useEffect} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {FadeImage} from './fade-image'
import type {SanityImage} from '@/lib/types'

type ProjectSliderProps = {
  images: SanityImage[]
  onIndexChange?: (index: number, total: number) => void
}

export function ProjectSlider({images, onIndexChange}: ProjectSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    duration: 0,
    align: 'start',
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    onIndexChange?.(emblaApi.selectedScrollSnap(), images.length)
  }, [emblaApi, images.length, onIndexChange])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (!images.length) return null

  return (
    <div className="relative h-[80dvh] max-h-[80dvh]">
      <div className="relative z-[1] h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="relative min-w-0 flex-[0_0_100%] h-full">
              <div className="relative flex h-full w-full items-start justify-center">
                <FadeImage
                  image={image}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="!absolute"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Previous image"
        className="absolute inset-y-0 left-0 z-[2] flex w-[50vw] cursor-w-resize items-center justify-center border-0 bg-transparent max-[767px]:w-[20vw]"
        onClick={() => emblaApi?.scrollPrev()}
      />
      <button
        type="button"
        aria-label="Next image"
        className="absolute inset-y-0 right-0 z-[2] flex w-[50vw] cursor-e-resize items-center justify-center border-0 bg-transparent max-[767px]:w-[20vw]"
        onClick={() => emblaApi?.scrollNext()}
      />
    </div>
  )
}
