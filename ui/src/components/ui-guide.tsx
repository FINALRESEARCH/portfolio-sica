'use client'

import {useEffect, useState} from 'react'

export function UiGuide() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 2200)
    const hide = () => setVisible(false)
    window.addEventListener('pointerdown', hide, {once: true})
    window.addEventListener('keydown', hide, {once: true})
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('pointerdown', hide)
      window.removeEventListener('keydown', hide)
    }
  }, [])

  return (
    <div
      className={`pointer-events-none absolute top-0 z-[2] flex h-[80dvh] max-h-[80dvh] w-full justify-between gap-4 p-4 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <div className="relative flex flex-1 items-center justify-center bg-[#eeeeee80]">
        <span
          className="block h-6 w-6 bg-contain bg-center bg-no-repeat"
          style={{backgroundImage: 'url(/images/arrow-left.svg)'}}
        />
      </div>
      <div className="relative flex flex-1 items-center justify-center bg-[#eeeeee80]">
        <span
          className="block h-6 w-6 bg-contain bg-center bg-no-repeat"
          style={{backgroundImage: 'url(/images/arrow-right.svg)'}}
        />
      </div>
    </div>
  )
}
