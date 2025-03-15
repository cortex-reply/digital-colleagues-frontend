import type { CollectionConfig } from "payload";
import { broadcastTaskChange } from "./hooks/broadcast-task-change";
import { broadcastTaskDelete } from "./hooks/broadcast-task-delete";

export const Tasks: CollectionConfig = {
  slug: "tasks",
  access: {
    read: () => true, // Public read access
  },
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    afterChange: [broadcastTaskChange],
    afterDelete: [broadcastTaskDelete],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "assignee",
      type: "relationship",
      relationTo: "colleagues",
      required: false,
      hasMany: false,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "backlog",
      options: [
        { label: "Backlog", value: "backlog" },
        { label: "To Do", value: "todo" },
        { label: "In Progress", value: "inProgress" },
        { label: "Done", value: "done" },
        { label: "Cancelled", value: "cancelled" },
      ],
      required: true,
    },
    {
      name: "project",
      type: "relationship",
      relationTo: "projects",
      hasMany: false,
    },
    {
      name: "epic",
      type: "relationship",
      relationTo: "epics",
      hasMany: false,
    },
    {
      name: "parents",
      type: "relationship",
      relationTo: "tasks",
      hasMany: true,
    },
    {
      name: "dateLogged",
      type: "date",
      defaultValue: () => new Date(),
      required: true,
    },
    {
      name: "closureDate",
      type: "date",
    },
    {
      name: "comments",
      type: "array",
      fields: [
        {
          name: "text",
          type: "textarea",
          required: true,
        },
        {
          name: "author",
          type: "relationship",
          relationTo: "users",
          required: true,
        },
        {
          name: "timestamp",
          type: "date",
          required: true,
        },
      ],
    },
  ],
};
