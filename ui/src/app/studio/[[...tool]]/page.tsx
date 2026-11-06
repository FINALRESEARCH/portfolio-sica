import {Studio} from './studio'

// Prerender the Studio shell so it's served as a static file, not a function.
export const dynamic = 'force-static'

export {metadata, viewport} from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
