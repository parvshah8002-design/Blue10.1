"use client";

import AppHeader from "@/components/AppHeader";
import PrimaryButton from "@/components/PrimaryButton";
import Disclaimer from "@/components/Disclaimer";
import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";

export default function HomePage() {
  const { language, setIsVolunteerMode } = useAppContext();
  const t = uiStrings[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <AppHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-orange-500 mb-5 shadow-lg shadow-blue-200">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
            {t.appName}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.tagline}
          </p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            {t.homeDescription}
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 mb-6">
          <PrimaryButton
            href="/form"
            onClick={() => setIsVolunteerMode(false)}
          >
            🙋 {t.checkForMyself}
          </PrimaryButton>

          <a
            href="/form"
            onClick={() => setIsVolunteerMode(true)}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-base bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            🤝 {t.helpSomeoneElse}
          </a>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <span className="text-2xl mb-1 block">🔒</span>
            <p className="text-xs text-gray-600 font-medium">No data stored</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <span className="text-2xl mb-1 block">⚡</span>
            <p className="text-xs text-gray-600 font-medium">Instant results</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <span className="text-2xl mb-1 block">📋</span>
            <p className="text-xs text-gray-600 font-medium">Document list</p>
          </div>
        </div>

        <Disclaimer />
      </main>
    </div>
  );
}
