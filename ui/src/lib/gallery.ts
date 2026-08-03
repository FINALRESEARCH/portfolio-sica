import type {SanityImage} from '@/lib/types'

/** Drop Webflow LQIP / blur thumbs that were imported as gallery slides. */
export function isUsableGalleryImage(image?: SanityImage | null, minWidth = 200) {
  if (!image?.asset) return false
  const width = image.asset.metadata?.dimensions?.width
  if (typeof width === 'number' && width > 0 && width < minWidth) return false
  return true
}

export function isScreenshotImage(image?: SanityImage | null) {
  const name = image?.asset?.originalFilename || ''
  return /screenshot/i.test(name)
}

export function filterGalleryImages(images?: SanityImage[] | null, minWidth = 200) {
  return (images || []).filter((image) => isUsableGalleryImage(image, minWidth))
}

/** Main carousel photos only — screenshots belong in BTS. */
export function splitProjectImages(gallery?: SanityImage[] | null, bts?: SanityImage[] | null) {
  const usableGallery = filterGalleryImages(gallery)
  const main = usableGallery.filter((image) => !isScreenshotImage(image))
  const fromGalleryBts = usableGallery.filter(isScreenshotImage)
  const btsImages = [...filterGalleryImages(bts), ...fromGalleryBts]
  return {gallery: main, btsImages}
}
