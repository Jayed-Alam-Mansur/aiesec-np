import type { CollectionConfig } from "payload";

export const LocalCommittees: CollectionConfig = {
  slug: "local-committees",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "location", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: 'e.g. "AIESEC in Kathmandu University"',
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier, e.g. kathmandu-university",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "location",
      type: "text",
      admin: {
        description: "City or campus name",
      },
    },
    {
      name: "contactEmail",
      type: "email",
    },
    {
      name: "socialLinks",
      type: "array",
      admin: {
        description: "Social media profiles for this LC",
      },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Facebook", value: "facebook" },
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Twitter / X", value: "twitter" },
            { label: "Website", value: "website" },
          ],
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
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
