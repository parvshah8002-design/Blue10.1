"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { useAppContext } from "@/context/AppContext";
import { uiStrings, formSteps } from "@/lib/mockData";
import { CitizenProfile } from "@/types";

export default function FormPage() {
  const { language, profile, setProfile } = useAppContext();
  const t = uiStrings[language];
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const step = formSteps[currentStep];

  const handleFieldChange = (
    fieldName: keyof CitizenProfile,
    value: string | number | boolean | string[]
  ) => {
    setProfile({ ...profile, [fieldName]: value });
    // Clear error on change
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of step.fields) {
      if (field.required) {
        const val = profile[field.name];
        if (val === null || val === undefined || val === "") {
          newErrors[field.name] = "This field is required";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/results");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderField = (field: (typeof step.fields)[0]) => {
    const value = profile[field.name];
    const label = field.label[language] || field.label.en;
    const helper = field.helperText
      ? field.helperText[language] || field.helperText.en
      : null;
    const placeholder = field.placeholder
      ? field.placeholder[language] || field.placeholder.en
      : "";
    const hasError = !!errors[field.name];

    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={(value as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={placeholder}
              className={`w-full px-4 py-3.5 rounded-xl border-2 text-base text-gray-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? "border-red-400" : "border-gray-200"
              }`}
            />
            {helper && (
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                💡 {helper}
              </p>
            )}
            {hasError && (
              <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={value !== null && value !== undefined ? String(value) : ""}
              onChange={(e) => {
                const v = e.target.value;
                handleFieldChange(
                  field.name,
                  v === "" ? (null as unknown as number) : Number(v)
                );
              }}
              placeholder={placeholder}
              className={`w-full px-4 py-3.5 rounded-xl border-2 text-base text-gray-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? "border-red-400" : "border-gray-200"
              }`}
            />
            {helper && (
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                💡 {helper}
              </p>
            )}
            {hasError && (
              <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={(value as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`w-full px-4 py-3.5 rounded-xl border-2 text-base text-gray-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                hasError ? "border-red-400" : "border-gray-200"
              }`}
            >
              <option value="">-- {label} --</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label[language] || opt.label.en}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {field.options?.map((opt) => {
                // Handle boolean fields
                const optValue = opt.value;
                const isSelected =
                  String(value) === optValue ||
                  value === (optValue === "true" ? true : optValue === "false" ? false : optValue);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const parsedVal =
                        opt.value === "true"
                          ? true
                          : opt.value === "false"
                          ? false
                          : opt.value;
                      handleFieldChange(field.name, parsedVal as string | boolean);
                    }}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {opt.label[language] || opt.label.en}
                  </button>
                );
              })}
            </div>
            {hasError && (
              <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </div>
        );

      case "multi-select":
        const selectedDocs = (value as string[]) || [];
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {label}
            </label>
            <div className="space-y-2">
              {field.options?.map((opt) => {
                const isChecked = selectedDocs.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const newDocs = isChecked
                        ? selectedDocs.filter((d) => d !== opt.value)
                        : [...selectedDocs, opt.value];
                      handleFieldChange(field.name, newDocs);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl border-2 text-sm transition-all flex items-center gap-3 ${
                      isChecked
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs ${
                        isChecked
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {isChecked && "✓"}
                    </span>
                    {opt.label[language] || opt.label.en}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="max-w-lg mx-auto px-4 py-6">
        <ProgressBar
          currentStep={currentStep + 1}
          totalSteps={formSteps.length}
        />

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            {step.title[language] || step.title.en}
          </h2>

          {step.fields.map(renderField)}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <SecondaryButton onClick={handleBack} className="flex-1">
              ← {t.back}
            </SecondaryButton>
          )}
          <PrimaryButton onClick={handleNext} className="flex-1">
            {currentStep === formSteps.length - 1
              ? `${t.submit} →`
              : `${t.next} →`}
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
