import type { CollectionConfig } from "payload";

export const Squads: CollectionConfig = {
  slug: "squads",
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
      name: "colleagues",
      type: "relationship",
      relationTo: "colleagues",
      hasMany: true,
    }
  ],
};

