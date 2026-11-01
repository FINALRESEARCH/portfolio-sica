import {useRef} from 'react'
import type {MouseEvent, TouchEvent} from 'react'

const THRESHOLD = 30

/**
 * Webflow-style swipe: a horizontal touch swipe or mouse drag on the slider
 * changes the slide instantly on release, with no follow-the-finger motion.
 * The click that ends a drag is swallowed so it doesn't also trigger an arrow.
 * Native image drag is left alone on purpose: as on the live site, a mouse drag
 * that starts on the home cover image does nothing.
 */
export function useSwipeNav(onPrev: () => void, onNext: () => void) {
  const start = useRef<{x: number} | null>(null)
  const swiped = useRef(false)

  const begin = (x: number) => {
    start.current = {x}
    swiped.current = false
  }

  const end = (x: number) => {
    if (!start.current) return
    // Like Webflow, only horizontal distance counts, so a diagonal swipe that
    // also scrolls the page still changes the slide.
    const dx = x - start.current.x
    start.current = null
    if (Math.abs(dx) < THRESHOLD) return
    swiped.current = true
    if (dx < 0) onNext()
    else onPrev()
  }

  return {
    onTouchStart: (e: TouchEvent) => begin(e.touches[0].clientX),
    onTouchEnd: (e: TouchEvent) => end(e.changedTouches[0].clientX),
    onMouseDown: (e: MouseEvent) => {
      if (e.button === 0) begin(e.clientX)
    },
    onMouseUp: (e: MouseEvent) => end(e.clientX),
    onClickCapture: (e: MouseEvent) => {
      if (!swiped.current) return
      swiped.current = false
      e.preventDefault()
      e.stopPropagation()
    },
  }
}
