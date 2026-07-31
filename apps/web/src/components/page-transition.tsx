'use client'

import {useEffect, useState} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/image'
import type {SanityImage} from '@/lib/types'

type PageTransitionProps = {
  image?: SanityImage | null
}

export function PageTransition({image}: PageTransitionProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 450)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!visible || !image?.asset) return null

  const src = urlForImage(image).width(2400).quality(80).auto('format').url()

  return (
    <div className="fixed inset-0 z-[999] h-[100dvh] w-[100dvw] bg-white transition-opacity duration-500 ease-in-out">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>
  )
}
