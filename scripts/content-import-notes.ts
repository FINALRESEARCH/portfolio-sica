/**
 * Content import helper for Webflow → Sanity.
 *
 * The HTML export has empty CMS bindings. When you have either:
 * - Webflow CMS CSV exports, or
 * - Live CDN asset URLs + titles,
 * map them into Sanity documents via Studio or the Sanity CLI/MCP.
 *
 * Suggested field mapping
 * -----------------------
 * Projects collection → project
 *   Name/Title      → title
 *   Slug            → slug.current
 *   Cover / Main    → coverImage
 *   Gallery images  → gallery[]
 *   Description     → description (Portable Text)
 *   Credits         → credits (Portable Text)
 *   BTS images      → btsImages[]
 *
 * SSENSE collection → ssenseItem
 *   Image / Caption / Link → image / caption / link
 *
 * More collection → moreItem
 *   Image / Caption / Link → image / caption / link
 *
 * Site chrome is already seeded as singleton `siteSettings`.
 */

export const CONTENT_IMPORT_STATUS = {
  siteSettings: 'published',
  projects: 'imported-from-sicathai.com (titles + gallery images)',
  ssenseItems: 'imported-from-sicathai.com',
  moreItems: 'imported-from-sicathai.com',
  notes:
    'Descriptions, credits, and BTS still need Studio review. Anonymous API reads may not see CLI-imported docs — use SANITY_API_READ_TOKEN in apps/web/.env.local.',
} as const
