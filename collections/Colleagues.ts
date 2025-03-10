import type { CollectionConfig } from 'payload'
import { relationship } from 'payload/shared'

export const Colleagues: CollectionConfig = {
  slug: 'colleagues',
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'colleagueType',
      type: 'select',
      options: [
        {
          label: 'Human',
          value: 'human',
        },
        {
          label: 'Digital',
          value: 'digital',
        },
      ],
      required: true
    },
    {
      name: "agents",
      type: "relationship",
      relationTo : "agents",
      hasMany: false,
      admin: {
        condition: (data) => {
          if(data.colleagueType === "digital"){return true} else {return false}
        }
      }
    },
    {
      name: "humans",
      type: "relationship",
      relationTo : "users",
      hasMany: false,
      admin: {
        condition: (data) => {
          if(data.colleagueType === "human"){return true} else {return false}
        }
      }
    }
  ],
}