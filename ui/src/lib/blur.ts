import type {SanityImage} from '@/lib/types'

/**
 * Blur-up placeholder from the LQIP Sanity generates on upload — no separate
 * blur exports needed. Wrapped in an SVG gaussian blur (same approach as
 * next/image's placeholder) sized to the image's aspect ratio, so it can be laid
 * out with background-size contain/cover exactly like the full image.
 */
export function blurBackground(image?: SanityImage | null): string | undefined {
  const lqip = image?.asset?.metadata?.lqip
  if (!lqip) return undefined
  const aspect = image?.asset?.metadata?.dimensions?.aspectRatio || 1
  const w = 40
  const h = Math.round(w / aspect)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='2'/><feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter><image width='100%' height='100%' preserveAspectRatio='none' style='filter:url(#b)' href='${lqip}'/></svg>`
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`
}
