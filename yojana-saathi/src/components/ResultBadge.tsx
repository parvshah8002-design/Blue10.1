"use client";

import { ResultStatus } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";

interface ResultBadgeProps {
  status: ResultStatus;
  size?: "sm" | "md" | "lg";
}

const badgeConfig: Record<
  ResultStatus,
  { bg: string; text: string; icon: string }
> = {
  eligible: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "✅" },
  possibly_eligible: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    icon: "⚠️",
  },
  not_eligible: { bg: "bg-red-100", text: "text-red-800", icon: "❌" },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export default function ResultBadge({ status, size = "md" }: ResultBadgeProps) {
  const { language } = useAppContext();
  const t = uiStrings[language];
  const config = badgeConfig[status];

  const labels: Record<ResultStatus, string> = {
    eligible: t.eligible,
    possibly_eligible: t.possiblyEligible,
    not_eligible: t.notEligible,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold
        ${config.bg} ${config.text} ${sizeClasses[size]}
      `}
    >
      <span>{config.icon}</span>
      {labels[status]}
    </span>
  );
}
