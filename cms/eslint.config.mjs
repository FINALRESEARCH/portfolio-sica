import { baseConfig } from '@sica/config/eslint/base'

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: ['dist/**', '.sanity/**'],
  },
]
