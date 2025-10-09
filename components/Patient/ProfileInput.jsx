const ProfileField = ({
  label,
  name,
  value,
  handleInputChange,
  isEditing,
  editData,
  type = "text",
  icon: Icon,
  isTextArea = false,
  error = "",
  disabled = false,
  readOnly = false,
  required = false,
}) => (
  <div>
    <label className="shad-input-label block mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-dark-600" />
      </div>
      {isTextArea ? (
        <textarea
          name={name}
          value={isEditing ? editData[name] : value}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`w-full rounded-xl border-[2px] shadow-lg
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
              ${!isEditing ? "bg-dark-500/50 cursor-not-allowed" : ""}`}
          rows={3}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={isEditing ? editData[name] : value}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`w-full rounded-xl border-[2px] shadow-lg
            ${Icon ? "pl-10 pr-3 py-2" : "px-3 py-2"}
            ${
              error
                ? "input-error-field focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-red-400 focus-visible:ring-[4px]"
                : "input-field focus-visible:ring-slate-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-gray-400 focus-visible:ring-[4px]"
            }
            bg-white text-slate-900 placeholder:text-slate-400 border-slate-300
            dark:bg-dark-400 dark:text-white dark:placeholder:text-dark-600 dark:border-dark-500
            transition-all duration-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
              ${!isEditing ? "bg-dark-500/50 cursor-not-allowed" : ""}`}
        />
      )}
    </div>
    {/* Error Message */}
    {error && (
      <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
        {error}
      </p>
    )}
  </div>
);

export default ProfileField;
