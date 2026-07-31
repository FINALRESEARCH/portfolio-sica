import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const moreItem = defineType({
  name: 'moreItem',
  title: 'More item',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'moreItem'}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title || 'More image',
        media,
      }
    },
  },
})
