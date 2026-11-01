'use client'

import {useEffect, useRef} from 'react'

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * FINAL RESEARCH credit hover (FINALRESEARCH/FR_CREDIT_HOVER, React port).
 * Hover/tap swaps the text and draws lines from each viewport corner to the
 * hover text, plus a frame around the viewport. On mobile a tap shows the
 * effect for ~1.5s, then navigates.
 */
export function FinalResearchCredit() {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const link = linkRef.current
    if (!link) return
    const hover = link.querySelector<HTMLElement>('.final-research-hover')
    const def = link.querySelector<HTMLElement>('.final-research-default')
    if (!hover) return
    let svg: SVGSVGElement | null = null
    let isHovering = false
    let navigateTimer = 0

    const themeColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() ||
      '#2e4369'
    const isMobile = () => window.innerWidth <= 724 || 'ontouchstart' in window

    const remove = () => {
      svg?.remove()
      svg = null
    }

    const draw = () => {
      remove()
      requestAnimationFrame(() => {
        const r = hover.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight
        const c = themeColor()
        const screen = [
          {x: 0, y: 0},
          {x: vw, y: 0},
          {x: 0, y: vh},
          {x: vw, y: vh},
        ]
        const block = [
          {x: r.left, y: r.top},
          {x: r.right, y: r.top},
          {x: r.left, y: r.bottom},
          {x: r.right, y: r.bottom},
        ]
        const el = document.createElementNS(SVG_NS, 'svg')
        el.setAttribute('class', 'final-research-corner-lines')
        el.style.cssText =
          'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;' +
          'z-index:2147483647;overflow:visible;'
        el.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
        el.setAttribute('preserveAspectRatio', 'none')
        el.setAttribute('aria-hidden', 'true')
        screen.forEach((s, i) => {
          const line = document.createElementNS(SVG_NS, 'line')
          line.setAttribute('x1', String(s.x))
          line.setAttribute('y1', String(s.y))
          line.setAttribute('x2', String(block[i].x))
          line.setAttribute('y2', String(block[i].y))
          line.setAttribute('stroke', c)
          line.setAttribute('stroke-width', '1')
          el.appendChild(line)
        })
        const frame = [
          {x: 0, y: 0, w: vw, h: 1.5},
          {x: 0, y: vh - 1.5, w: vw, h: 1.5},
          {x: 0, y: 0, w: 1.5, h: vh},
          {x: vw - 1.5, y: 0, w: 1.5, h: vh},
        ]
        frame.forEach((f) => {
          const rect = document.createElementNS(SVG_NS, 'rect')
          rect.setAttribute('x', String(f.x))
          rect.setAttribute('y', String(f.y))
          rect.setAttribute('width', String(f.w))
          rect.setAttribute('height', String(f.h))
          rect.setAttribute('fill', c)
          el.appendChild(rect)
        })
        document.body.appendChild(el)
        svg = el
      })
    }

    const showHover = () => {
      if (def) def.style.visibility = 'hidden'
      hover.style.opacity = '1'
      hover.style.visibility = 'visible'
    }
    const hideHover = () => {
      if (def) def.style.visibility = 'visible'
      hover.style.opacity = '0'
      hover.style.visibility = 'hidden'
    }

    const onClick = (e: MouseEvent) => {
      if (!isMobile()) return
      e.preventDefault()
      showHover()
      draw()
      navigateTimer = window.setTimeout(() => {
        remove()
        hideHover()
        window.location.href = link.href
      }, 1500)
    }
    const onEnter = () => {
      isHovering = true
      if (!isMobile()) draw()
    }
    const onLeave = () => {
      isHovering = false
      if (!isMobile()) remove()
    }
    const onReflow = () => {
      if (isHovering && svg) draw()
    }

    link.addEventListener('click', onClick)
    link.addEventListener('mouseenter', onEnter)
    link.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, {passive: true})
    return () => {
      link.removeEventListener('click', onClick)
      link.removeEventListener('mouseenter', onEnter)
      link.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow)
      window.clearTimeout(navigateTimer)
      remove()
    }
  }, [])

  return (
    <div className="final-research-credit">
      <a
        id="final-research"
        ref={linkRef}
        href="https://finalresearch.org"
        target="_blank"
        rel="noopener"
      >
        <span className="final-research-default">Website by FINAL RESEARCH</span>
        <span className="final-research-hover">FINALRESEARCH.ORG</span>
      </a>
    </div>
  )
}
