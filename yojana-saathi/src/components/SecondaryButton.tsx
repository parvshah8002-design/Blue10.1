"use client";

import { ReactNode } from "react";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  href?: string;
}

export default function SecondaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  href,
}: SecondaryButtonProps) {
  const baseClasses = `
    w-full py-3.5 px-6 rounded-2xl font-semibold text-base
    bg-white text-gray-700 border-2 border-gray-200
    hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed
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
