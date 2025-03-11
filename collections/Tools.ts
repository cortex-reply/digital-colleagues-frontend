import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  access: {
    read: () => true, // Public read access
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'toolSpecs',
      type: 'relationship',
      relationTo: 'toolspecs',
      hasMany: false,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}