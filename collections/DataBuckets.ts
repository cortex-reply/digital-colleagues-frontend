import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "data-buckets",
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
      name: "workInstructions",
      type: "textarea",
    },
    {
      name: "squads",
      type: "relationship",
      relationTo: "squads", // Link to the agents collection
      hasMany: false, // Allow linking to multiple agents
    },
  ],
};
