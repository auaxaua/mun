"use client";

import { useState } from "react";

type PasswordInputProps = React.ComponentPropsWithoutRef<"input"> & {
  label?: string;
};

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function PasswordInput({ label, className = "", ...inputProps }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  const inputClass =
    "h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 pe-12 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      ) : null}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={inputClass + (className ? ` ${className}` : "")}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute end-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          tabIndex={-1}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
