#!/usr/bin/env node
/**
 * Scrapes https://sicathai.com and prints JSON inventory for Sanity import.
 * Usage: node scripts/scrape-webflow-live.mjs
 */

const BASE = 'https://sicathai.com'

async function fetchHtml(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.text()
}

function extractProjectLinks(html) {
  const links = [...html.matchAll(/href="\/project\/([^"#]+)"/g)].map((m) => m[1])
  return [...new Set(links)]
}

function extractIndexTitles(html) {
  const block = html.match(/Index[\s\S]*?SSENSE/i)?.[0] || ''
  return [...block.matchAll(/href="\/project\/([^"]+)"[^>]*>([^<]+)</g)].map((m) => ({
    slug: m[1],
    title: m[2].trim(),
  }))
}

function extractImages(html) {
  const urls = [...html.matchAll(/https:\/\/cdn\.prod\.website-files\.com\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map(
    (m) => m[0].replace(/&amp;/g, '&'),
  )
  return [...new Set(urls)].filter((u) => !u.includes('OPENGRAPH') && !u.includes('placeholder'))
}

function extractRichText(html, label) {
  // Best-effort: grab adjacent richtext after a title label
  const re = new RegExp(`${label}[\\s\\S]{0,200}?w-richtext[\\s\\S]*?<\\/div>`, 'i')
  const match = html.match(re)?.[0]
  if (!match) return ''
  return match
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+\n/g, '\n')
    .trim()
}

async function scrapeProject(slug, title) {
  const html = await fetchHtml(`/project/${slug}`)
  const images = extractImages(html)
  return {
    slug,
    title: title || slug,
    coverImage: images[0] || null,
    gallery: images,
    description: extractRichText(html, 'BTS') ? '' : extractRichText(html, title || ''),
    pageUrl: `${BASE}/project/${slug}`,
  }
}

async function scrapeGallery(path) {
  const html = await fetchHtml(path)
  const images = extractImages(html)
  const captions = [...html.matchAll(/misc-image-caption[^>]*>([^<]*)</g)].map((m) => m[1].trim())
  return images.map((image, i) => ({
    image,
    caption: captions[i] || '',
  }))
}

async function main() {
  const home = await fetchHtml('/')
  const titles = extractIndexTitles(home)
  const slugs = extractProjectLinks(home)
  const projects = []
  for (const slug of slugs) {
    const title = titles.find((t) => t.slug === slug)?.title || slug
    projects.push(await scrapeProject(slug, title))
  }

  const ssense = await scrapeGallery('/ssense')
  const more = await scrapeGallery('/more')

  const inventory = {projects, ssense, more, scrapedAt: new Date().toISOString()}
  console.log(JSON.stringify(inventory, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
