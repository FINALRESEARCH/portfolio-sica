import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      initialValue: 'SICA THAI',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brandName',
      title: 'Brand name',
      type: 'string',
      initialValue: 'Sica Thai',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'string',
      initialValue: 'Stylist and wardrobe consultant',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      initialValue: 'sicathai37@gmail.com',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      initialValue: 'https://instagram.com/sicamode',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
      initialValue: '©2025 SICA THAI',
    }),
    defineField({
      name: 'designerCredit',
      title: 'Designer credit',
      type: 'designerCredit',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Open Graph image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ssenseIntro',
      title: 'SSENSE page intro',
      type: 'ssenseIntro',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site settings'}
    },
  },
})
