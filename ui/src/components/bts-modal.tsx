'use client'

import {useEffect} from 'react'
import {FadeImage} from './fade-image'
import type {SanityImage} from '@/lib/types'

type BtsModalProps = {
  open: boolean
  onClose: () => void
  title?: string | null
  images?: SanityImage[] | null
}

export function BtsModal({open, onClose, title, images}: BtsModalProps) {
  useEffect(() => {
    if (!open) return
    document.body.classList.add('overflow-hidden')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('overflow-hidden')
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    // Stays mounted while closed so it reopens at the same scroll position, like Webflow.
    <div
      className={`fixed inset-0 z-[998] overflow-auto bg-white max-[768px]:pb-16 ${open ? '' : 'hidden'}`}
      aria-hidden={!open}
    >
      <div className="fixed inset-x-4 bottom-2 z-[999] flex justify-between max-[480px]:bottom-[9px] max-[480px]:left-2">
        <div className="flex gap-1.5">
          <span className="inline-block opacity-30">{title}</span>
          <span className="inline-block opacity-30">(BTS)</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer opacity-30 transition-opacity duration-300 hover:opacity-100"
        >
          close
        </button>
      </div>
      <div className="mx-auto flex max-w-[40vw] justify-center max-[768px]:max-w-none">
        <div className="flex w-full flex-col gap-20">
          {images?.map((image, index) => (
            <div key={index} className="relative w-full">
              <FadeImage
                image={image}
                width={image.asset?.metadata?.dimensions?.width || 1200}
                height={image.asset?.metadata?.dimensions?.height || 1600}
                sizes="(max-width: 767px) 100vw, 40vw"
                className="!relative h-auto w-full"
                objectFit="contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
