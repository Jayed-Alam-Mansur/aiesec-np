import { z } from "zod";

// ── Per-type field schemas ──────────────────────────────────────────

export const memberFieldsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  college: z.string().min(1, "College is required"),
  message: z.string().optional(),
});

export const partnerFieldsSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  contactEmail: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  partnershipType: z.enum(["sponsorship", "collaboration", "media", "other"], {
    errorMap: () => ({ message: "Select a valid partnership type" }),
  }),
  message: z.string().optional(),
});

export const exchangeFieldsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  program: z.enum(
    ["global-volunteer", "global-talent", "global-teacher"],
    {
      errorMap: () => ({ message: "Select a valid program" }),
    },
  ),
  college: z.string().min(1, "College is required"),
  motivation: z.string().optional(),
});

// ── Discriminated union ─────────────────────────────────────────────

export const formSubmissionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("member"),
    fields: memberFieldsSchema,
  }),
  z.object({
    type: z.literal("partner"),
    fields: partnerFieldsSchema,
  }),
  z.object({
    type: z.literal("exchange"),
    fields: exchangeFieldsSchema,
  }),
]);

export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>;
