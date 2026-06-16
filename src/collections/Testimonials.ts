import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "quote",
    defaultColumns: ["member", "rating", "isVisible"],
  },
  access: {
    read: ({ req }) => {
      if (req.user) {
        return true;
      }

      return {
        isVisible: {
          equals: true,
        },
      };
    },
  },
  fields: [
    {
      name: "member",
      type: "relationship",
      relationTo: "members",
      required: true,
    },
    {
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      name: "isVisible",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
