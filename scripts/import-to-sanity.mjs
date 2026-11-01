#!/usr/bin/env node
/**
 * Import the scraped Webflow inventory into Sanity.
 *
 * Downloads every original image from the Webflow CDN and uploads it as a
 * Sanity asset. Sanity generates the LQIP / palette blur-up metadata on upload,
 * so no separate blur images are needed. Documents are published (not drafts)
 * with deterministic IDs, so re-running is idempotent.
 *
 * Requires SANITY_API_WRITE_TOKEN (Editor or higher), read from the env or
 * the repo-root .env.local.
 * Usage: pnpm import:sanity
 */

import {createRequire} from 'node:module'
import {createHash} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(__dirname, '../ui/package.json'))
const {createClient} = require('@sanity/client')

const envFile = join(__dirname, '../.env.local')
if (existsSync(envFile)) process.loadEnvFile(envFile)

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'fdog0g13'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-07-31',
  token,
  useCdn: false,
})

const inventory = JSON.parse(readFileSync(join(__dirname, 'webflow-inventory.json'), 'utf8'))

const hash = (value) => createHash('md5').update(value).digest('hex').slice(0, 12)

/**
 * Convert a Webflow rich-text paragraph (HTML) into a Portable Text block.
 * Supports the marks the project schema defines: grey, strong, em, link.
 */
function paragraphToBlock(html, index) {
  const markDefs = []
  const children = []
  const stack = []
  const tokens = html.split(/(<[^>]+>)/g)
  for (const token of tokens) {
    if (!token) continue
    const tag = token.match(/^<(\/?)(\w+)([^>]*)>$/)
    if (tag) {
      const [, closing, name, attrs] = tag
      if (closing) {
        stack.pop()
        continue
      }
      if (name === 'br') {
        children.push({text: '\n', marks: [...stack]})
      } else if (name === 'a') {
        const key = `l${markDefs.length}`
        markDefs.push({_type: 'link', _key: key, href: attrs.match(/href="([^"]*)"/)?.[1]})
        stack.push(key)
      } else if (name === 'span' && /class="grey"/.test(attrs)) {
        stack.push('grey')
      } else if (name === 'strong' || name === 'b') {
        stack.push('strong')
      } else if (name === 'em' || name === 'i') {
        stack.push('em')
      } else {
        stack.push(null)
      }
      continue
    }
    const text = token.replace(/ /g, ' ')
    if (text) children.push({text, marks: stack.filter(Boolean)})
  }
  return {
    _type: 'block',
    _key: `b${index}${hash(html)}`,
    style: 'normal',
    markDefs,
    children: children.map((child, i) => ({_type: 'span', _key: `s${i}`, ...child})),
  }
}

function toBlocks(paragraphs) {
  const blocks = (paragraphs || [])
    .filter((p) => p.replace(/[​-‍\s]/g, ''))
    .map(paragraphToBlock)
  return blocks.length ? blocks : undefined
}

const assetCache = new Map()

async function uploadImage(url, {alt} = {}) {
  if (!url) return null
  if (!assetCache.has(url)) {
    assetCache.set(
      url,
      (async () => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed download ${url}: ${res.status}`)
        const buffer = Buffer.from(await res.arrayBuffer())
        const filename = decodeURIComponent(url.split('/').pop() || 'image.jpg')
          // Strip Webflow's 24-char asset ID prefix
          .replace(/^[0-9a-f]{24}_/, '')
        const asset = await client.assets.upload('image', buffer, {
          filename,
          source: {name: 'webflow', id: url, url},
        })
        return asset._id
      })(),
    )
  }
  const ref = await assetCache.get(url)
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: ref},
    ...(alt ? {alt} : {}),
  }
}

async function uploadList(urls, alt) {
  const images = await Promise.all([...new Set(urls)].map((url) => uploadImage(url, {alt})))
  return images.map((image, i) => ({...image, _key: `i${i}${hash(image.asset._ref)}`}))
}

/** Lexicographic rank strings compatible with @sanity/orderable-document-list. */
function orderRank(index) {
  return `0|${String(index).padStart(5, '0')}0000:`
}

async function upsertProject(project, index) {
  const [coverImage, gallery, btsImages] = await Promise.all([
    uploadImage(project.coverImage, {alt: project.title}),
    uploadList(project.gallery, project.title),
    uploadList(project.btsImages, `${project.title} behind the scenes`),
  ])

  await client.createOrReplace({
    _id: `project-${project.slug}`,
    _type: 'project',
    orderRank: orderRank(index),
    title: project.title,
    slug: {_type: 'slug', current: project.slug},
    coverImage,
    gallery,
    btsImages: btsImages.length ? btsImages : undefined,
    description: toBlocks(project.description),
    credits: toBlocks(project.credits),
  })
  console.log(
    `✓ project ${project.slug} (${gallery.length} gallery, ${btsImages.length} bts)`,
  )
}

async function upsertMisc(type, items) {
  for (const [i, item] of items.entries()) {
    const image = await uploadImage(item.image, {alt: item.caption || undefined})
    await client.createOrReplace({
      _id: `${type}-${hash(item.image)}`,
      _type: type,
      orderRank: orderRank(i),
      image,
      caption: item.caption || undefined,
      link: item.link || undefined,
    })
  }
  console.log(`✓ ${items.length} ${type} documents`)
}

async function upsertSiteSettings() {
  await client.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'SICA THAI',
    brandName: 'Sica Thai',
    bio: 'Stylist and wardrobe consultant',
    email: 'sicathai37@gmail.com',
    instagramUrl: 'https://instagram.com/sicamode',
    copyright: 'SICA THAI',
    seoDescription:
      'Sica Thai — stylist and wardrobe consultant. Selected projects, SSENSE, and more.',
    ssenseIntro: {_type: 'ssenseIntro', title: 'SSENSE', description: 'E-Commerce Styling'},
  })
  console.log('✓ siteSettings')
}

async function main() {
  console.log(`Importing into ${projectId}/${dataset}`)
  await upsertSiteSettings()
  for (const [index, project] of inventory.projects.entries()) {
    await upsertProject(project, index)
  }
  await upsertMisc('ssenseItem', inventory.ssense)
  await upsertMisc('moreItem', inventory.more)
  console.log(`Done. ${assetCache.size} images.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
