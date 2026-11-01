'use client'

import {useEffect, useRef, useState} from 'react'
import type {MouseEvent} from 'react'

type ScrollJumpButtonsProps = {
  navId?: string
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

/** Webflow's built-in anchor scroller: easeInOutCubic, duration grows with distance. */
function webflowScrollTo(targetY: number) {
  const startY = window.scrollY
  const distance = targetY - startY
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = reduced ? 0 : Math.max(0, 472.143 * Math.log(Math.abs(distance) + 125) - 2000)
  if (!duration) {
    window.scrollTo(0, targetY)
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    window.scrollTo(0, startY + distance * easeInOutCubic(t))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()
  history.pushState(null, '', `#${id}`)
  webflowScrollTo(target.getBoundingClientRect().top + window.scrollY)
}

export function ScrollJumpButtons({navId = 'nav'}: ScrollJumpButtonsProps) {
  const [atBottom, setAtBottom] = useState(false)
  // Like the Webflow interaction: the outgoing arrow lingers ~500ms, then the
  // incoming one fades in over 500ms.
  const [shown, setShown] = useState<'top' | 'bottom'>('bottom')
  const [faded, setFaded] = useState(true)
  const shownRef = useRef<'top' | 'bottom'>('bottom')

  useEffect(() => {
    const nav = document.getElementById(navId)
    if (!nav) return
    const observer = new IntersectionObserver(([entry]) => setAtBottom(entry.isIntersecting))
    observer.observe(nav)
    return () => observer.disconnect()
  }, [navId])

  useEffect(() => {
    const next = atBottom ? 'top' : 'bottom'
    let frame = 0
    if (shownRef.current === next) return
    const timer = window.setTimeout(() => {
      shownRef.current = next
      setShown(next)
      setFaded(false)
      // Show it at opacity 0 first so the fade-in actually transitions.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setFaded(true))
      })
    }, 500)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [atBottom])

  const button = (direction: 'top' | 'bottom') => {
    return (
      <a
        key={direction}
        href={direction === 'top' ? '#top' : `#${navId}`}
        onClick={(event) => jumpTo(event, direction === 'top' ? 'top' : navId)}
        className={`fixed right-4 bottom-4 z-10 transition-opacity duration-500 max-[480px]:right-2 max-[480px]:bottom-2 ${
          shown === direction ? 'block' : 'hidden'
        } ${shown === direction && faded ? 'opacity-100' : 'opacity-0'}`}
        aria-label={direction === 'top' ? 'Go to top' : 'Go to navigation'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
        <img
          src="/images/arrow-left.svg"
          alt=""
          width={25}
          height={26}
          className={direction === 'top' ? 'rotate-90' : '-rotate-90'}
        />
      </a>
    )
  }

  return (
    <>
      {button('top')}
      {button('bottom')}
    </>
  )
}
