#!/usr/bin/env node
/**
 * Scrapes https://www.sicathai.com and prints a JSON inventory for Sanity import.
 * Reads Webflow's rendered CMS markup, so only original image URLs are kept —
 * hand-exported `-blur` backgrounds and `-p-500` srcset derivatives are ignored.
 * Usage: node scripts/scrape-webflow-live.mjs > scripts/webflow-inventory.json
 */

const BASE = 'https://www.sicathai.com'

async function fetchHtml(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.text()
}

function decodeEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

/** Inner HTML of the first element after `from` whose class list contains `cls`. */
function sliceByClass(html, cls, from = 0) {
  const re = new RegExp(`<div[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'g')
  re.lastIndex = from
  const open = re.exec(html)
  if (!open) return null
  let depth = 1
  let i = open.index + open[0].length
  const tag = /<(\/?)div\b[^>]*>/g
  tag.lastIndex = i
  let m
  while ((m = tag.exec(html))) {
    depth += m[1] ? -1 : 1
    if (depth === 0) return {inner: html.slice(i, m.index), end: tag.lastIndex}
  }
  return null
}

function imgSrcs(html) {
  return [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => decodeEntities(m[1]))
}

/** Rich text paragraphs. Webflow stores credits as escaped HTML that Finsweet re-parses client-side. */
function richTextParagraphs(html) {
  if (!html) return []
  return [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((m) => decodeEntities(m[1]).replace(/<br\s*\/?>/gi, '\n').trim())
    .filter(Boolean)
}

function detailSections(html) {
  const sections = []
  let from = 0
  let section
  while ((section = sliceByClass(html, 'project-details-section', from))) {
    from = section.end
    const title = sliceByClass(section.inner, 'project-details-title')?.inner || ''
    const label = decodeEntities(title.match(/<div>([^<]*)<\/div>/)?.[1] || '').trim()
    const body = sliceByClass(section.inner, 'project-details-description')?.inner || ''
    sections.push({label, paragraphs: richTextParagraphs(body)})
  }
  return sections
}

function scrapeHome(html) {
  const items = [
    ...html.matchAll(
      /<a[^>]*href="\/project\/([^"#]+)"[^>]*class="slider-image-link[^"]*"[^>]*>\s*<img[^>]*\ssrc="([^"]+)"/g,
    ),
  ]
  const covers = Object.fromEntries(items.map((m) => [m[1], decodeEntities(m[2])]))
  const index = [
    ...html.matchAll(/<a href="\/project\/([^"#]+)"[^>]*class="link[^"]*"[^>]*>([^<]+)<\/a>/g),
  ].map((m) => ({slug: m[1], title: decodeEntities(m[2]).trim()}))
  return {covers, index}
}

async function scrapeProject({slug, title}, cover) {
  const html = await fetchHtml(`/project/${slug}`)
  const gallery = [
    ...html.matchAll(/class="project-page-image[^"]*"[^>]*>\s*<img[^>]*\ssrc="([^"]+)"/g),
  ].map((m) => decodeEntities(m[1]))
  const btsList = sliceByClass(html, 'bts-image-list')?.inner || ''
  const [details, credits] = detailSections(html)
  return {
    slug,
    title,
    coverImage: cover || gallery[0] || null,
    gallery,
    btsImages: imgSrcs(btsList),
    description: details?.paragraphs || [],
    credits: credits?.label === 'Credits' ? credits.paragraphs : [],
    pageUrl: `${BASE}/project/${slug}`,
  }
}

async function scrapeMisc(path) {
  const html = await fetchHtml(path)
  return [
    ...html.matchAll(
      /<div class="misc-image-block">\s*<a href="([^"]*)"[^>]*class="misc-image-link([^"]*)"[^>]*><\/a>\s*<img[^>]*\ssrc="([^"]+)"[^>]*\/?>\s*<div class="misc-image-caption">([\s\S]*?)<\/div>/g,
    ),
  ].map((m) => ({
    image: decodeEntities(m[3]),
    caption: decodeEntities(m[4]).trim(),
    link: m[1] !== '#' && !m[2].includes('w-condition-invisible') ? decodeEntities(m[1]) : null,
  }))
}

async function main() {
  const {covers, index} = scrapeHome(await fetchHtml('/'))
  const projects = []
  for (const entry of index) projects.push(await scrapeProject(entry, covers[entry.slug]))
  const ssense = await scrapeMisc('/ssense')
  const more = await scrapeMisc('/more')
  const inventory = {projects, ssense, more, scrapedAt: new Date().toISOString()}
  console.log(JSON.stringify(inventory, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
