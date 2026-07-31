import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'qht5ld5w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'sica-portfolio',
  title: 'SICA Portfolio',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool()],
  schema: {types: schemaTypes},
})
