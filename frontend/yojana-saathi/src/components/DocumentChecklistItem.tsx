"use client";

import { DocumentChecklistItem as DocItem, Language } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";

interface DocumentChecklistItemProps {
  item: DocItem;
}

const statusConfig = {
  available: { icon: "✅", bg: "bg-emerald-50", border: "border-emerald-200" },
  missing: { icon: "❌", bg: "bg-red-50", border: "border-red-200" },
  unknown: { icon: "❓", bg: "bg-gray-50", border: "border-gray-200" },
  not_required: { icon: "➖", bg: "bg-gray-50", border: "border-gray-200" },
};

export default function DocumentChecklistItemComponent({
  item,
}: DocumentChecklistItemProps) {
  const { language } = useAppContext();
  const t = uiStrings[language];
  const config = statusConfig[item.status];

  const statusLabels = {
    available: t.documentAvailable,
    missing: t.documentMissing,
    unknown: t.documentUnknown,
    not_required: t.documentNotRequired,
  };

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-xl p-3 flex items-start gap-3`}
    >
      <span className="text-lg mt-0.5">{config.icon}</span>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">
          {item.name[language] || item.name.en}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {statusLabels[item.status]}
        </p>
        {item.status === "missing" && item.issuingAuthority && (
          <p className="text-xs text-gray-500 mt-1">
            📍{" "}
            {item.issuingAuthority[language] || item.issuingAuthority.en}
          </p>
        )}
        {item.status === "missing" && item.howToGet && (
          <p className="text-xs text-blue-600 mt-1">
            {item.howToGet[language] || item.howToGet.en}
          </p>
        )}
      </div>
    </div>
  );
}
