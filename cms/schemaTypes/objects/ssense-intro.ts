import {defineField, defineType} from 'sanity'

export const ssenseIntro = defineType({
  name: 'ssenseIntro',
  title: 'SSENSE intro',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'SSENSE',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      initialValue: 'E-Commerce Styling',
    }),
  ],
})
