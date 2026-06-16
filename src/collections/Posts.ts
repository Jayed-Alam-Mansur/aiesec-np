import type { CollectionConfig } from "payload";

const categoryOptions = [
  { label: "Member", value: "member" },
  { label: "Events", value: "events" },
  { label: "Exchange", value: "exchange" },
  { label: "Impact", value: "impact" },
];

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "published", "publishedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier, e.g. leadership-summit-2026",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: categoryOptions,
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.published),
      },
    },
  ],
};
