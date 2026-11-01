'use client'

import Image from 'next/image'
import {useCallback, useState} from 'react'
import {blurBackground} from '@/lib/blur'
import {urlForImage} from '@/sanity/lib/image'
import type {SanityImage} from '@/lib/types'

type FadeImageProps = {
  image?: SanityImage | null
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  objectFit?: 'contain' | 'cover'
  objectPosition?: string
  /** Fade-in duration; the live site uses 500ms on home and 300ms on projects. */
  fadeDuration?: 300 | 500
}

export function FadeImage({
  image,
  alt = '',
  fill,
  width,
  height,
  className = '',
  priority,
  sizes,
  objectFit = 'contain',
  objectPosition = '50% 0%',
  fadeDuration = 500,
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false)
  const assetId = image?.asset?._id

  const markLoaded = useCallback(() => {
    setLoaded(true)
  }, [])

  // Cached / already-decoded images may not fire onLoad after mount.
  const imageRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (!node) return
      if (node.complete && node.naturalWidth > 0) {
        markLoaded()
      }
    },
    [markLoaded],
  )

  if (!image?.asset) return null

  const altText = alt || image.alt || ''
  const src = urlForImage(image).width(2400).quality(85).auto('format').url()
  const blur = blurBackground(image)

  const img = (
    <Image
      key={assetId || src}
      ref={imageRef}
      src={src}
      alt={altText}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      onLoad={markLoaded}
      onError={markLoaded}
      data-fade=""
      // The pre-hydration script may add data-loaded.
      suppressHydrationWarning
      className={`transition-opacity ease-in-out ${fadeDuration === 300 ? 'duration-300' : 'duration-500'} ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{objectFit, objectPosition}}
    />
  )

  if (!blur) return img

  // Blur-up layer sits behind the image, laid out like it, and is removed once
  // the fade-in has finished (so transparent PNGs don't show it through).
  const blurLayer = (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-0 ${loaded ? `opacity-0 ${fadeDuration === 300 ? 'delay-300' : 'delay-500'}` : 'opacity-100'}`}
      style={{
        backgroundImage: blur,
        backgroundSize: objectFit,
        backgroundPosition: objectPosition,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )

  if (fill) {
    return (
      <>
        {blurLayer}
        {img}
      </>
    )
  }

  return (
    <div className="relative">
      {blurLayer}
      {img}
    </div>
  )
}
