import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "YojanaSaathi — Scheme Eligibility Navigator",
  description:
    "Find government schemes you may qualify for. Answer simple questions to discover welfare schemes that match your profile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
