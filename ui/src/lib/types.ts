import type {SanityImageSource} from '@sanity/image-url'

export type PortableTextBlock = {
  _type: string
  _key?: string
  [key: string]: unknown
}

export type SanityImage = SanityImageSource & {
  alt?: string | null
  asset?: {
    _id?: string
    url?: string
    originalFilename?: string | null
    metadata?: {
      lqip?: string
      dimensions?: {
        width?: number
        height?: number
        aspectRatio?: number
      }
    }
  } | null
}

export type SsenseIntro = {
  title?: string | null
  description?: string | null
}

export type SiteSettings = {
  siteTitle?: string | null
  brandName?: string | null
  bio?: string | null
  email?: string | null
  instagramUrl?: string | null
  copyright?: string | null
  seoDescription?: string | null
  ssenseIntro?: SsenseIntro | null
  defaultOgImage?: SanityImage | null
}

export type ProjectIndexItem = {
  _id: string
  title?: string | null
  slug?: string | null
  coverImage?: SanityImage | null
}

export type Project = {
  _id: string
  title?: string | null
  slug?: string | null
  coverImage?: SanityImage | null
  gallery?: SanityImage[] | null
  description?: PortableTextBlock[] | null
  credits?: PortableTextBlock[] | null
  btsImages?: SanityImage[] | null
  seo?: {
    title?: string | null
    description?: string | null
    ogImage?: SanityImage | null
  } | null
}

export type MiscItem = {
  _id: string
  caption?: string | null
  link?: string | null
  image?: SanityImage | null
}
