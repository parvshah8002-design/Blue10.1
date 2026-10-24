"use client";

import { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  href?: string;
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  href,
}: PrimaryButtonProps) {
  const baseClasses = `
    w-full py-4 px-6 rounded-2xl font-semibold text-lg
    bg-gradient-to-r from-blue-600 to-blue-700 text-white
    shadow-lg shadow-blue-200
    hover:shadow-xl hover:from-blue-700 hover:to-blue-800
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
    transition-all duration-200
    flex items-center justify-center gap-2
    ${className}
  `;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
