"use client";

import { useState } from "react";
import { FeedbackType } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";
import PrimaryButton from "./PrimaryButton";

interface FeedbackModalProps {
  schemeId: string;
  isOpen: boolean;
  onClose: () => void;
}

const feedbackOptions: { value: FeedbackType; labelKey: keyof typeof uiStrings.en }[] = [
  { value: "wrong_eligibility_rule", labelKey: "wrongEligibilityRule" },
  { value: "outdated_information", labelKey: "outdatedInformation" },
  { value: "broken_application_link", labelKey: "brokenApplicationLink" },
  { value: "translation_issue", labelKey: "translationIssue" },
  { value: "missing_document", labelKey: "missingDocument" },
];

export default function FeedbackModal({
  schemeId,
  isOpen,
  onClose,
}: FeedbackModalProps) {
  const { language } = useAppContext();
  const t = uiStrings[language];
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Mock submission — just show success state
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelected(null);
      setComment("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slideUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              {t.feedbackTitle}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <span className="text-5xl mb-4 block">🎉</span>
              <p className="text-lg font-semibold text-emerald-700">
                {t.feedbackSuccess}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-5">
                {feedbackOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelected(option.value)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm
                      ${
                        selected === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-800"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {t[option.labelKey]}
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.commentPlaceholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
              />

              <PrimaryButton onClick={handleSubmit} disabled={!selected}>
                {t.feedbackSubmit}
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
