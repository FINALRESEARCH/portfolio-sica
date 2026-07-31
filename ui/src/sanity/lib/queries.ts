import {defineQuery} from 'next-sanity'

const imageFields = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions
    }
  },
  hotspot,
  crop,
  alt
`

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  siteTitle,
  brandName,
  bio,
  email,
  instagramUrl,
  copyright,
  designerCredit,
  seoDescription,
  ssenseIntro,
  defaultOgImage {
    ${imageFields}
  }
}`)

export const PROJECTS_INDEX_QUERY = defineQuery(`*[_type == "project"] | order(orderRank) {
  _id,
  title,
  "slug": slug.current,
  coverImage {
    ${imageFields}
  }
}`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  coverImage {
    ${imageFields}
  },
  gallery[] {
    ${imageFields}
  },
  description,
  credits,
  btsImages[] {
    ${imageFields}
  },
  seo {
    title,
    description,
    ogImage {
      ${imageFields}
    }
  }
}`)

export const PROJECT_SLUGS_QUERY = defineQuery(`*[_type == "project" && defined(slug.current)]{
  "slug": slug.current
}`)

export const SSENSE_ITEMS_QUERY = defineQuery(`*[_type == "ssenseItem"] | order(orderRank) {
  _id,
  caption,
  link,
  image {
    ${imageFields}
  }
}`)

export const MORE_ITEMS_QUERY = defineQuery(`*[_type == "moreItem"] | order(orderRank) {
  _id,
  caption,
  link,
  image {
    ${imageFields}
  }
}`)

export const SITEMAP_QUERY = defineQuery(`{
  "projects": *[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`)
