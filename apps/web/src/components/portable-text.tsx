import {PortableText as BasePortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@/lib/types'

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="mb-1">{children}</p>,
  },
  marks: {
    link: ({children, value}) => {
      const href = value?.href as string | undefined
      const isExternal = href?.startsWith('http')
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-2 transition-opacity duration-300 hover:opacity-30"
        >
          {children}
        </a>
      )
    },
  },
}

export function PortableText({value}: {value?: PortableTextBlock[] | null}) {
  if (!value?.length) return null
  return (
    <BasePortableText
      value={value as Parameters<typeof BasePortableText>[0]['value']}
      components={components}
    />
  )
}
