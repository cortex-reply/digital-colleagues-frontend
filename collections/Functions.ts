import type { CollectionConfig } from "payload";

export const Functions: CollectionConfig = {
  slug: "functions",
  access: {
    read: () => true, // Public read access
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "systemMsg",
      type: "textarea",
    },
    {
      name: "squad",
      type: "relationship",
      relationTo: "squads",
      hasMany: false
    },
    {
      name: "knowledeBase",
      type: "relationship",
      relationTo: "knowledgeBases"
    }
  ],
};
