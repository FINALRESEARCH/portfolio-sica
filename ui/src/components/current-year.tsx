'use client'

import {useSyncExternalStore} from 'react'

const noop = () => () => {}
const currentYear = () => new Date().getFullYear()

/**
 * The current year, read in the browser. Statically built pages would
 * otherwise keep the year they were built in until the next deploy.
 */
export function CurrentYear() {
  return useSyncExternalStore(noop, currentYear, currentYear)
}
