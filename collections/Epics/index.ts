import type { CollectionConfig } from "payload";
import { broadcastEpicChange } from "./hooks/broadcast-epic-change";
import { broadcastEpicDelete } from "./hooks/broadcast-epic-delete";

export const Epics: CollectionConfig = {
  slug: "epics",
  access: {
    read: () => true, // Public read access
  },
  hooks: {
    afterChange: [broadcastEpicChange],
    afterDelete: [broadcastEpicDelete],
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
      name: "project",
      type: "relationship",
      relationTo: "projects",
    },
  ],
};
