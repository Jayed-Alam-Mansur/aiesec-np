import type { CollectionConfig } from "payload";

export const Members: CollectionConfig = {
  slug: "members",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "position", "lc", "status"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "fullName",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "college",
      type: "text",
    },
    {
      name: "position",
      type: "text",
      admin: {
        description: 'e.g. "VP of Marketing", "LCVP OGX"',
      },
    },
    {
      name: "lc",
      type: "relationship",
      relationTo: "local-committees",
      admin: {
        description: "Which local committee this member belongs to",
      },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "linkedin",
      type: "text",
      admin: {
        description: "LinkedIn profile URL",
      },
    },
    {
      name: "joinedAt",
      type: "date",
      admin: {
        description: "When this member joined AIESEC",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ],
};
