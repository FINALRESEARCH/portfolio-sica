import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {ImagesIcon, CaseIcon, CogIcon} from '@sanity/icons'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings')),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        icon: CaseIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'ssenseItem',
        title: 'SSENSE',
        icon: ImagesIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'moreItem',
        title: 'More',
        icon: ImagesIcon,
        S,
        context,
      }),
    ])
