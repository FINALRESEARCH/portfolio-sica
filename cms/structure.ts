import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {DocumentIcon, FolderIcon} from '@sanity/icons'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .icon(DocumentIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings')),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        icon: FolderIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'ssenseItem',
        title: 'SSENSE',
        icon: FolderIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'moreItem',
        title: 'More',
        icon: FolderIcon,
        S,
        context,
      }),
    ])
