'use client'

import {useEffect, useState} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/image'
import type {SanityImage} from '@/lib/types'

type PageTransitionProps = {
  image?: SanityImage | null
}

export function PageTransition({image}: PageTransitionProps) {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible')

  useEffect(() => {
    // Hold the large blurry cover, then fade to the normal project view.
    const fade = window.setTimeout(() => setPhase('fading'), 500)
    const done = window.setTimeout(() => setPhase('done'), 1000)
    return () => {
      window.clearTimeout(fade)
      window.clearTimeout(done)
    }
  }, [])

  if (phase === 'done' || !image?.asset) return null

  const src = urlForImage(image).width(2400).quality(80).auto('format').url()

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[999] h-[100dvh] w-[100dvw] overflow-hidden bg-white transition-opacity duration-500 ease-in-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-110 object-cover blur-2xl"
      />
    </div>
  )
}
