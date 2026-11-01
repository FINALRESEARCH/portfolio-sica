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
    <div className="mx-auto flex max-w-[40vw] justify-center max-[768px]:max-w-none">
      <div className="flex w-full flex-col gap-32 max-[768px]:gap-20">
        {items.map((item) => (
          <div key={item._id} className="relative flex flex-col gap-4 max-[480px]:gap-2">
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
              sizes="(max-width: 767px) 100vw, 40vw"
              className="!relative h-auto w-full"
            />
            {item.caption ? (
              <div className="text-[gray] max-[768px]:ml-4 max-[480px]:ml-2">{item.caption}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
