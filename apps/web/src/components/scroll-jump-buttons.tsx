'use client'

import {useEffect, useState} from 'react'
import Image from 'next/image'

type ScrollJumpButtonsProps = {
  navId?: string
}

export function ScrollJumpButtons({navId = 'nav'}: ScrollJumpButtonsProps) {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const nav = document.getElementById(navId)
    if (!nav) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setAtBottom(entry.isIntersecting)
      },
      {threshold: 0.1},
    )

    observer.observe(nav)
    return () => observer.disconnect()
  }, [navId])

  return (
    <>
      <a
        href="#top"
        className={`fixed right-4 bottom-4 z-10 transition-opacity duration-300 ${
          atBottom ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Go to top"
      >
        <Image
          src="/images/arrow-left.svg"
          alt=""
          width={16}
          height={16}
          className="rotate-90"
        />
      </a>
      <a
        href={`#${navId}`}
        className={`fixed right-4 bottom-4 z-10 transition-opacity duration-300 ${
          atBottom ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-label="Go to navigation"
      >
        <Image
          src="/images/arrow-left.svg"
          alt=""
          width={16}
          height={16}
          className="-rotate-90"
        />
      </a>
    </>
  )
}
