import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
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
      name: 'tools',
      type: 'relationship',
      relationTo: 'tools', // Link to the Tools collection
      hasMany: true, // Allow linking to multiple tools
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'systemMsg',
      type: 'textarea',
    },
  ],
}