import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'fdog0g13'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {projectId, dataset},
  studioHost: 'sica-portfolio',
  typegen: {
    path: '../ui/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../ui/src/sanity/types.ts',
  },
  autoUpdates: true,
})
