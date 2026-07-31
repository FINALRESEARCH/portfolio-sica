import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'qht5ld5w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {projectId, dataset},
  studioHost: 'sica-portfolio',
  typegen: {
    path: '../web/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../web/src/sanity/types.ts',
  },
  autoUpdates: true,
})
