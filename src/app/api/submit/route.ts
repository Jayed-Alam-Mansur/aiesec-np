import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  appendToGoogleSheet,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";
import { prisma } from "@/lib/prisma";
import { formSubmissionSchema } from "@/lib/validations/form-submission";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = formSubmissionSchema.parse(body);

    // Save to database
    const submission = await prisma.formSubmission.create({
      data: {
        type: parsed.type,
        data: parsed.fields as Prisma.InputJsonValue,
      },
    });

    // Sync to Google Sheets (best-effort)
    if (isGoogleSheetsConfigured()) {
      try {
        await appendToGoogleSheet(parsed.type, parsed.fields);
      } catch (sheetsError) {
        console.error("Google Sheets sync failed:", sheetsError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid submission",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    console.error("Form submission failed:", error);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 },
    );
  }
}
