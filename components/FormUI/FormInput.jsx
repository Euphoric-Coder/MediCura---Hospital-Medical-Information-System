import React, { forwardRef } from "react";
import { cn } from "@/lib/utils"; // optional helper if you have shadcn utils

const FormInput = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      min,
      max,
      className = "",
      readOnly = false,
      icon,
    },
    ref
  ) => {
    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium mb-2 text-gray-200 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative w-full">
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            min={min}
            max={max}
            className={cn(
              `w-full rounded-lg border bg-dark-300 text-white placeholder-gray-400 
               focus:outline-none focus-visible:ring-[3px] focus-visible:ring-offset-0
               transition-all duration-300
               ${icon ? "pl-10 pr-3 py-2" : "px-3 py-2"}
               ${disabled || readOnly ? "opacity-70 cursor-not-allowed" : ""}`,
              error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-dark-500 focus-visible:ring-blue-500"
            )}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
