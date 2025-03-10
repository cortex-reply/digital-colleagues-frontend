import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "files",
  access: {
    read: () => true, // Public read access
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "reference",
      type: "text",
    },
  ],
};
