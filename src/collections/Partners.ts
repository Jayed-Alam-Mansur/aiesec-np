import type { CollectionConfig } from "payload";

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "website"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "website",
      type: "text",
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Current", value: "current" },
        { label: "Previous", value: "previous" },
        { label: "Collaborator", value: "collaborator" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Short blurb about the partnership",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Display order (lower = first)",
      },
    },
  ],
};
