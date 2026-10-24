"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";
import { Language } from "@/types";

export default function AppHeader() {
  const { language, setLanguage, isVolunteerMode } = useAppContext();
  const t = uiStrings[language];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 text-white text-sm">
            🏛️
          </span>
          <span className="font-bold text-gray-900 text-lg">{t.appName}</span>
        </Link>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select language"
          >
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
      </div>

      {isVolunteerMode && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-2">
          <p className="text-center text-sm font-medium text-amber-800">
            🤝 {t.volunteerBanner}
          </p>
        </div>
      )}
    </header>
  );
}
