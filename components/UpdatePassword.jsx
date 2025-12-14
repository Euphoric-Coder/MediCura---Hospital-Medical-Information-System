import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

const UpdatePasswordForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onBack();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onBack]);


  const passwordRequirements = useMemo(() => {
    const password = formData.newPassword;
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [formData.newPassword]);

  const allRequirementsMet = useMemo(() => {
    return Object.values(passwordRequirements).every((req) => req);
  }, [passwordRequirements]);

  const passwordStrength = useMemo(() => {
    const metRequirements = Object.values(passwordRequirements).filter(
      (req) => req
    ).length;
    if (metRequirements === 0) return { label: "", color: "", width: "0%" };
    if (metRequirements <= 2)
      return {
        label: "Weak",
        color: "bg-red-500 dark:bg-red-600",
        width: "33%",
      };
    if (metRequirements <= 4)
      return {
        label: "Medium",
        color: "bg-yellow-500 dark:bg-yellow-600",
        width: "66%",
      };
    return {
      label: "Strong",
      color: "bg-green-500 dark:bg-green-600",
      width: "100%",
    };
  }, [passwordRequirements]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePasswords = () => {
    if (!allRequirementsMet) {
      setMessage("Please meet all password requirements");
      setMessageType("error");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match");
      setMessageType("error");
      return false;
    }
    if (formData.oldPassword === formData.newPassword) {
      setMessage("New password must be different from old password");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully!");
        setMessageType("success");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.error || "Failed to update password");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-[95vh] rounded-3xl bg-gray-50 dark:bg-gray-950 overflow-auto">
      {/* Header */}

      {/* Main Content */}
      <div className="container py-5">
        <div className="sub-container max-w-md mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span className="text-18-bold text-green-600 dark:text-green-400">
                Security Settings
              </span>
            </div>

            <h1 className="text-36-bold text-gray-900 dark:text-gray-100 mb-2">
              Update Password
            </h1>

            <p className="text-16-regular text-gray-600 dark:text-gray-400">
              Keep your account secure by updating your password regularly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="shad-input-label block mb-2 text-gray-700 dark:text-gray-300">
                Current password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                </div>

                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className="
                shad-input pl-10 pr-12 w-full rounded-3xl
                bg-white text-gray-900 border-gray-300 placeholder:text-gray-400
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500
                focus:border-2 focus:border-green-500 dark:focus:border-green-400 focus:ring-0 focus:ring-offset-0 outline-none focus:outline-none focus-visible:outline-none
              "
                  required
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="
                absolute inset-y-0 right-0 pr-3 flex items-center
                text-gray-500 hover:text-gray-700
                dark:text-gray-500 dark:hover:text-gray-300 transition-colors
              "
                >
                  {showPasswords.old ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="shad-input-label block mb-2 text-gray-700 dark:text-gray-300">
                New password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                </div>

                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="
                shad-input pl-10 pr-12 w-full rounded-3xl
                bg-white text-gray-900 border-gray-300 placeholder:text-gray-400
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500
                focus:border-2 focus:border-green-500 dark:focus:border-green-400 focus:ring-0 focus:ring-offset-0 outline-none focus:outline-none focus-visible:outline-none
              "
                  required
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="
                absolute inset-y-0 right-0 pr-3 flex items-center
                text-gray-500 hover:text-gray-700
                dark:text-gray-500 dark:hover:text-gray-300 transition-colors
              "
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-12-regular text-gray-500 dark:text-gray-500">
                      Password Strength
                    </span>

                    <span
                      className={`text-12-semibold ${
                        passwordStrength.label === "Weak"
                          ? "text-red-500"
                          : passwordStrength.label === "Medium"
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: passwordStrength.width }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {formData.newPassword && (
                <div
                  className="
                mt-4 p-4 rounded-lg space-y-2
                bg-gray-100 border border-gray-300
                dark:bg-gray-800 dark:border-gray-700
              "
                >
                  <p className="text-12-semibold text-gray-900 dark:text-gray-200">
                    Password Requirements:
                  </p>

                  {[
                    ["minLength", "At least 8 characters"],
                    ["hasUppercase", "One uppercase letter (A–Z)"],
                    ["hasLowercase", "One lowercase letter (a–z)"],
                    ["hasNumber", "One number (0–9)"],
                    ["hasSpecialChar", "One special character (!@#$%^&*)"],
                  ].map(([key, label]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 text-12-regular ${
                        passwordRequirements[key]
                          ? "text-green-500"
                          : "text-gray-500 dark:text-gray-500"
                      }`}
                    >
                      {passwordRequirements[key] ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="shad-input-label block mb-2 text-gray-700 dark:text-gray-300">
                Confirm new password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                </div>

                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className="
                shad-input pl-10 pr-12 w-full rounded-3xl
                bg-white text-gray-900 border-gray-300 placeholder:text-gray-400
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500
                focus:border-2 focus:border-green-500 dark:focus:border-green-400 focus:ring-0 focus:ring-offset-0 outline-none focus:outline-none focus-visible:outline-none
              "
                  required
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="
                absolute inset-y-0 right-0 pr-3 flex items-center
                text-gray-500 hover:text-gray-700
                dark:text-gray-500 dark:hover:text-gray-300 transition-colors
              "
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Match / Not Match */}
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="text-12-regular text-red-500 mt-1 flex items-center gap-1">
                    <X className="w-4 h-4" /> Passwords do not match
                  </p>
                )}

              {formData.confirmPassword &&
                formData.newPassword === formData.confirmPassword && (
                  <p className="text-12-regular text-green-500 mt-1 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Passwords match
                  </p>
                )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`
              flex items-center gap-3 p-4 rounded-lg border
              ${
                messageType === "success"
                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                  : "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
              }
            `}
              >
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-14-regular">{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !allRequirementsMet}
              className="
            w-full py-3 px-4 rounded-3xl text-16-semibold flex items-center justify-center gap-2
            text-white bg-green-600 hover:bg-green-700
            dark:bg-green-600 dark:hover:bg-green-700
            disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
            transition-colors
          "
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div
            className="
          mt-10 p-6 rounded-lg border
          bg-gray-100 border-gray-300
          dark:bg-gray-800 dark:border-gray-700
        "
          >
            <h3 className="text-16-semibold text-gray-900 dark:text-gray-100 mb-4">
              Password Security Tips
            </h3>

            <ul className="space-y-2 text-14-regular text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Use strong combinations with uppercase, lowercase, numbers, and
                symbols.
              </li>

              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Avoid using personal information or predictable words.
              </li>

              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Don’t reuse passwords across different accounts.
              </li>

              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Update your password frequently for improved safety.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
