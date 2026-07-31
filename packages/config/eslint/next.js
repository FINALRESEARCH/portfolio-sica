import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'
import { baseConfig } from './base.js'

/**
 * ESLint config for Next.js apps.
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = defineConfig([
  ...baseConfig,
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
