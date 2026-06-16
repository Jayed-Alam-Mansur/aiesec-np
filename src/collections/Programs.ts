import type { CollectionConfig } from "payload";

export const Programs: CollectionConfig = {
  slug: "programs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "duration", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: 'e.g. "Global Volunteer", "Global Talent"',
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier, e.g. global-volunteer",
      },
    },
    {
      name: "shortDescription",
      type: "textarea",
      admin: {
        description: "One-liner shown on cards",
      },
    },
    {
      name: "description",
      type: "richText",
      admin: {
        description: "Full program details",
      },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Small icon/logo for this program",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "eligibility",
      type: "textarea",
      admin: {
        description: "Who can apply",
      },
    },
    {
      name: "duration",
      type: "text",
      admin: {
        description: 'e.g. "6-8 weeks", "6-18 months"',
      },
    },
    {
      name: "applyLink",
      type: "text",
      admin: {
        description: "External application URL",
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
