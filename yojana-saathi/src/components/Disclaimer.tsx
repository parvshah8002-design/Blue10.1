"use client";

import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";

export default function Disclaimer() {
  const { language } = useAppContext();
  const t = uiStrings[language];

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-6">
      <p className="text-sm text-amber-800 text-center leading-relaxed">
        ⚠️ {t.disclaimer}
      </p>
    </div>
  );
}
