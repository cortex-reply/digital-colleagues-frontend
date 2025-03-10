import type { CollectionConfig } from 'payload'

export const Teams: CollectionConfig = {
  slug: 'teams',
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
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Selector Group Chat',
          value: 'SelectorGroupChat',
        },
        {
          label: 'Round Robin Group Chat',
          value: 'RoundRobinGroupChat',
        },
        {
          label: 'Swarm',
          value: 'Swarm',
        },
      ],
      required: true,
    },
    {
      name: 'agents',
      type: 'relationship',
      relationTo: 'agents', // Link to the agents collection
      hasMany: true, // Allow linking to multiple agents
    },
  ],
}