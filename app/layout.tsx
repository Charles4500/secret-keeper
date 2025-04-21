import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";


export const metadata: Metadata = {
  title: "Safe Key - Password Generator & Manage",
  description: "Generate strong passwords and manage them securely with Safe Key.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
