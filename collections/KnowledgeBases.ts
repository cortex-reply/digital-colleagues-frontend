import type { CollectionConfig } from 'payload'

export const KnowledgeBases: CollectionConfig = {
  slug: 'knowledgeBases',
  access: {
    read: () => true, // Public read access
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'knowledgeBaseId',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
        name: 'description',
        type: 'textarea',
    }
  ],
}