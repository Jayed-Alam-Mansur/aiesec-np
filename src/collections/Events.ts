import type { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "eventDate", "location", "published"],
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
      admin: {
        description: "Short summary for cards and previews",
      },
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "eventDate",
      type: "date",
      required: true,
      admin: {
        description: "Start date/time of the event",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        description: "End date/time (leave blank for single-day events)",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "location",
      type: "text",
      admin: {
        description: "Venue or 'Online'",
      },
    },
    {
      name: "registrationLink",
      type: "text",
      admin: {
        description: "External registration URL (Google Form, Eventbrite, etc.)",
      },
    },
    {
      name: "isUpcoming",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Uncheck after the event has concluded",
      },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
