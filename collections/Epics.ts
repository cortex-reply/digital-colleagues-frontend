import type { CollectionConfig } from 'payload'

export const Epics: CollectionConfig = {
  slug: 'epics',
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
      name: "project",
      type: "relationship",
      relationTo: "projects"
    }
  ],
}