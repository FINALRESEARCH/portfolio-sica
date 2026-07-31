import {FadeImage} from './fade-image'
import type {MiscItem} from '@/lib/types'

type MiscGalleryProps = {
  items: MiscItem[]
  emptyLabel: string
}

export function MiscGallery({items, emptyLabel}: MiscGalleryProps) {
  if (!items.length) {
    return (
      <div className="px-4 py-24 text-center opacity-30">{emptyLabel}</div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[40vw] justify-center max-[767px]:max-w-[70vw] max-[479px]:max-w-none max-[479px]:px-4">
      <div className="flex w-full flex-col gap-32 max-[767px]:gap-16 max-[479px]:gap-12">
        {items.map((item) => (
          <div key={item._id} className="relative flex flex-col gap-4">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-[1]"
                aria-label={item.caption || 'Open link'}
              />
            ) : null}
            <FadeImage
              image={item.image}
              alt={item.caption || ''}
              width={item.image?.asset?.metadata?.dimensions?.width || 1200}
              height={item.image?.asset?.metadata?.dimensions?.height || 1600}
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 70vw, 40vw"
              className="!relative h-auto w-full"
            />
            {item.caption ? (
              <div className="text-gray-500">{item.caption}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
