'use client'

import Image from 'next/image'
import {useCallback, useState} from 'react'
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
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false)

  // Cached / already-decoded images may not fire onLoad after mount.
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [])

  if (!image?.asset) return null

  const altText = alt || image.alt || ''
  const lqip = image.asset.metadata?.lqip
  const src = urlForImage(image).width(2400).quality(85).auto('format').url()

  return (
    <Image
      ref={imageRef}
      src={src}
      alt={altText}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip || undefined}
      onLoad={() => setLoaded(true)}
      className={`transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{objectFit, objectPosition}}
    />
  )
}
