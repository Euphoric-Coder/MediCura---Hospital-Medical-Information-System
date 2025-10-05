"use client";

import React from "react";

/**
 * InputField — reusable input component with
 * light/dark theme support, icons, and validation styles.
 */
const InputField = ({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  error = "",
  icon: Icon,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-[15px] font-medium text-slate-800 dark:text-slate-200"
        >
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
        )}

        {/* Input Field */}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`
            w-full rounded-xl border-[2px] shadow-lg
            ${Icon ? "pl-10 pr-3 py-2" : "px-3 py-2"}
            ${
              error
                ? "input-error-field focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-red-400 focus-visible:ring-[4px]"
                : "input-field focus-visible:ring-slate-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-gray-400 focus-visible:ring-[4px]"
            }
            bg-white text-slate-900 placeholder:text-slate-400 border-slate-300
            dark:bg-dark-400 dark:text-white dark:placeholder:text-dark-600 dark:border-dark-500
            transition-all duration-500 focus:outline-none
            ${disabled || readOnly ? "cursor-not-allowed opacity-70" : ""}
          `}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
