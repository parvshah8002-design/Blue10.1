"use client";

import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";
import { Language } from "@/types";

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useAppContext();
  const t = uiStrings[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 mb-4">
          <span className="text-3xl">🏛️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.appName}</h1>
        <p className="text-gray-500 text-lg">{t.selectLanguage}</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`
              w-full py-5 px-6 rounded-2xl text-left transition-all duration-200
              border-2 flex items-center justify-between
              ${
                language === lang.code
                  ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }
            `}
            aria-label={`Select ${lang.label}`}
          >
            <div>
              <span className="text-xl font-semibold text-gray-900">
                {lang.native}
              </span>
              {lang.code !== "en" && (
                <span className="text-sm text-gray-500 ml-2">
                  ({lang.label})
                </span>
              )}
            </div>
            {language === lang.code && (
              <span className="text-blue-600 text-xl">✓</span>
            )}
          </button>
        ))}
      </div>

      <a
        href="/home"
        className="mt-8 w-full max-w-sm inline-flex items-center justify-center py-4 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
      >
        {t.next} →
      </a>
    </div>
  );
}
