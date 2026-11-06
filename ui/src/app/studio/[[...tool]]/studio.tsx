'use client'

import {NextStudio} from 'next-sanity/studio'
import config from '../../../../../cms/sanity.config'

export function Studio() {
  return <NextStudio config={{...config, basePath: '/studio'}} />
}
