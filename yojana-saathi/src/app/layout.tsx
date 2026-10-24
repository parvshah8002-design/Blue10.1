import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-gray-50">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
