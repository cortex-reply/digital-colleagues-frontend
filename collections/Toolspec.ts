import type { CollectionConfig } from 'payload'

export const Toolspec: CollectionConfig = {
  slug: 'toolspec',
  access: {
    read: () => true, // Public read access
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'spec',
      type: 'code',
      admin: {
        language: 'yaml',
      },
    },
  ],
}