import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "AIESEC Nepal API",
  description: "Backend for the AIESEC Nepal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
