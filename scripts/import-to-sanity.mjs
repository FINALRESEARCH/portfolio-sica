#!/usr/bin/env node
/**
 * Import scraped Webflow inventory into Sanity.
 *
 * Requires SANITY_API_WRITE_TOKEN (Editor or higher).
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... node scripts/import-to-sanity.mjs
 */

import {createRequire} from 'node:module'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(__dirname, '../ui/package.json'))
const {createClient} = require('@sanity/client')
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'qht5ld5w'
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

const inventory = JSON.parse(
  readFileSync(join(__dirname, 'webflow-inventory.json'), 'utf8'),
)

function isPrimaryImage(url) {
  if (!url) return false
  if (/FAVICON|OPENGRAPH|webclip|placeholder/i.test(url)) return false
  if (/-p-\d+\./i.test(url)) return false
  return true
}

function uniquePrimary(urls) {
  return [...new Set((urls || []).filter(isPrimaryImage))]
}

function textToBlocks(text) {
  if (!text?.trim()) return undefined
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      _type: 'block',
      _key: createHash('md5').update(line).digest('hex').slice(0, 12),
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: 's', text: line, marks: []}],
    }))
}

const assetCache = new Map()

async function uploadImage(url) {
  if (!url) return null
  if (assetCache.has(url)) return assetCache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed download ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = decodeURIComponent(url.split('/').pop() || 'image.jpg').replace(/\s+/g, '-')
  const asset = await client.assets.upload('image', buffer, {filename})
  const image = {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
  assetCache.set(url, image)
  return image
}

function orderRank(index) {
  // Lexicographic ranks compatible with orderable-document-list style strings
  return `0|${String(index).padStart(5, '0')}0000`
}

async function upsertProject(project, index) {
  const galleryUrls = uniquePrimary(project.gallery)
  const coverUrl = isPrimaryImage(project.coverImage) ? project.coverImage : galleryUrls[0]
  const coverImage = await uploadImage(coverUrl)
  const gallery = []
  for (const url of galleryUrls) {
    gallery.push(await uploadImage(url))
  }

  const doc = {
    _id: `project.${project.slug}`,
    _type: 'project',
    title: project.title,
    slug: {_type: 'slug', current: project.slug},
    coverImage,
    gallery,
    orderRank: orderRank(index),
    description: textToBlocks(project.description),
  }

  await client.createOrReplace(doc)
  console.log(`✓ project ${project.slug} (${gallery.length} images)`)
}

async function upsertMisc(type, items) {
  let i = 0
  for (const item of items) {
    if (!isPrimaryImage(item.image)) continue
    const image = await uploadImage(item.image)
    const id = `${type}.${createHash('md5').update(item.image).digest('hex').slice(0, 12)}`
    await client.createOrReplace({
      _id: id,
      _type: type,
      image,
      caption: item.caption || undefined,
      orderRank: orderRank(i),
    })
    i += 1
    console.log(`✓ ${type} #${i}`)
  }
}

async function main() {
  console.log(`Importing into ${projectId}/${dataset}`)
  for (const [index, project] of inventory.projects.entries()) {
    await upsertProject(project, index)
  }
  await upsertMisc('ssenseItem', inventory.ssense)
  await upsertMisc('moreItem', inventory.more)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
