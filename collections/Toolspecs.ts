import type { CollectionConfig } from 'payload'

export const Toolspecs: CollectionConfig = {
  slug: 'toolspecs',
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