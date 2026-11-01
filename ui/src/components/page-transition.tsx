'use client'

import {useEffect, useState} from 'react'
import {blurBackground} from '@/lib/blur'
import type {SanityImage} from '@/lib/types'

type PageTransitionProps = {
  image?: SanityImage | null
}

export function PageTransition({image}: PageTransitionProps) {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible')

  useEffect(() => {
    // Like the Webflow original: hold the blurry cover until the page has fully
    // loaded, then 500ms more, then fade out over 500ms.
    let fade = 0
    let done = 0
    const start = () => {
      fade = window.setTimeout(() => setPhase('fading'), 500)
      done = window.setTimeout(() => setPhase('done'), 1000)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, {once: true})
    return () => {
      window.removeEventListener('load', start)
      window.clearTimeout(fade)
      window.clearTimeout(done)
    }
  }, [])

  if (phase === 'done' || !image?.asset) return null

  const blur = blurBackground(image)

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[999] h-[100dvh] w-[100dvw] overflow-hidden bg-white transition-opacity duration-500 ease-in-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden
    >
      {blur ? (
        <div
          className="absolute inset-0"
          style={{backgroundImage: blur, backgroundSize: 'cover', backgroundPosition: '50% 50%'}}
        />
      ) : null}
    </div>
  )
}
