import type {Metadata} from 'next'
import type {SanityImage} from '@/lib/types'
import {urlForImage} from '@/sanity/lib/image'

export const SITE_NAME = 'SICA THAI'

export const DEFAULT_DESCRIPTION =
  'Sica Thai — stylist and wardrobe consultant. Selected projects, SSENSE, and more.'

/** Static fallback used when Sanity has no default / page OG image. */
export const DEFAULT_OG_IMAGE = {
  url: '/images/OPENGRAPH-IMG.png',
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const

export function resolveOgImageUrl(source?: SanityImage | null): string {
  if (source?.asset) {
    return urlForImage(source).width(1200).height(630).fit('crop').url()
  }
  return DEFAULT_OG_IMAGE.url
}

type SocialMetadataInput = {
  title: string
  description?: string | null
  /** Absolute URL, site-relative path, or Sanity image. */
  image?: string | SanityImage | null
  path?: string
}

export function socialMetadata({
  title,
  description,
  image,
  path,
}: SocialMetadataInput): Metadata {
  const resolvedDescription = description || DEFAULT_DESCRIPTION
  const imageUrl =
    typeof image === 'string'
      ? image
      : image
        ? resolveOgImageUrl(image)
        : DEFAULT_OG_IMAGE.url

  const ogImage = {
    url: imageUrl,
    width: DEFAULT_OG_IMAGE.width,
    height: DEFAULT_OG_IMAGE.height,
    alt: title || DEFAULT_OG_IMAGE.alt,
  }

  return {
    title,
    description: resolvedDescription,
    openGraph: {
      title,
      description: resolvedDescription,
      type: 'website',
      siteName: SITE_NAME,
      ...(path ? {url: path} : {}),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: [imageUrl],
    },
    ...(path ? {alternates: {canonical: path}} : {}),
  }
}
