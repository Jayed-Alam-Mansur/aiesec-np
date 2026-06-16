import { google } from "googleapis";

export type FormType = "member" | "partner" | "exchange";

export type FormFields = Record<string, unknown>;

// ── Sheet tab names per form type ───────────────────────────────────

const SHEET_TAB_MAP: Record<FormType, string> = {
  member: "Member Signups",
  partner: "Partner Applications",
  exchange: "Exchange Applications",
};

// ── Column headers per form type ────────────────────────────────────

const COLUMN_HEADERS: Record<FormType, string[]> = {
  member: ["Timestamp", "Name", "Email", "Phone", "College", "Message"],
  partner: [
    "Timestamp",
    "Organization",
    "Contact Person",
    "Email",
    "Phone",
    "Partnership Type",
    "Message",
  ],
  exchange: [
    "Timestamp",
    "Name",
    "Email",
    "Phone",
    "Program",
    "College",
    "Motivation",
  ],
};

// ── Row builder per form type ───────────────────────────────────────

function buildRow(type: FormType, fields: FormFields): string[] {
  const timestamp = new Date().toISOString();

  switch (type) {
    case "member":
      return [
        timestamp,
        String(fields.name ?? ""),
        String(fields.email ?? ""),
        String(fields.phone ?? ""),
        String(fields.college ?? ""),
        String(fields.message ?? ""),
      ];
    case "partner":
      return [
        timestamp,
        String(fields.organizationName ?? ""),
        String(fields.contactPerson ?? ""),
        String(fields.contactEmail ?? ""),
        String(fields.phone ?? ""),
        String(fields.partnershipType ?? ""),
        String(fields.message ?? ""),
      ];
    case "exchange":
      return [
        timestamp,
        String(fields.name ?? ""),
        String(fields.email ?? ""),
        String(fields.phone ?? ""),
        String(fields.program ?? ""),
        String(fields.college ?? ""),
        String(fields.motivation ?? ""),
      ];
  }
}

// ── Google Auth ──────────────────────────────────────────────────────

function getSheetsClient() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT;

  if (!credentialsJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT is not configured");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentialsJson),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// ── Ensure tab exists with headers ──────────────────────────────────

async function ensureSheetTab(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  type: FormType,
) {
  const tabName = SHEET_TAB_MAP[type];

  // Check if the tab already exists
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const existingTabs =
    spreadsheet.data.sheets?.map((s) => s.properties?.title) ?? [];

  if (!existingTabs.includes(tabName)) {
    // Create the tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: tabName },
            },
          },
        ],
      },
    });

    // Write header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${tabName}'!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [COLUMN_HEADERS[type]] },
    });
  }
}

// ── Public API ───────────────────────────────────────────────────────

export async function appendToGoogleSheet(type: FormType, fields: FormFields) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not configured");
  }

  const sheets = getSheetsClient();
  const tabName = SHEET_TAB_MAP[type];

  // Auto-create the tab with headers if it doesn't exist
  await ensureSheetTab(sheets, spreadsheetId, type);

  const row = buildRow(type, fields);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${tabName}'!A:Z`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

export function isGoogleSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT && process.env.GOOGLE_SHEET_ID,
  );
}
