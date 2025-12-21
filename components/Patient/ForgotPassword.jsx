import React, { useState, useMemo } from "react";
import {
  Plus,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Check,
  X,
  KeyRound,
} from "lucide-react";

const ForgotPassword = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const passwordRequirements = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };
  }, [newPassword]);

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

  React.useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation, this would call Supabase:
      // const { error } = await supabase.auth.resetPasswordForEmail(email);

      setMessage("Verification code sent to your email!");
      setMessageType("success");
      setStep("verification");
      setResendTimer(60);
    } catch (error) {
      setMessage("Failed to send verification code. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage("New verification code sent!");
      setMessageType("success");
      setResendTimer(60);
    } catch (error) {
      setMessage("Failed to resend code. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      setMessage("Please enter a valid 6-digit code");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate verification
      setMessage("Code verified successfully!");
      setMessageType("success");
      setTimeout(() => {
        setStep("reset");
        setMessage("");
      }, 1000);
    } catch (error) {
      setMessage("Invalid verification code. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      setMessage("Please meet all password requirements");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation:
      // const { error } = await supabase.auth.updateUser({ password: newPassword });

      setMessage("Password reset successfully!");
      setMessageType("success");

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onBack();
        }
      }, 2000);
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-24-bold text-gray-900 dark:text-gray-100">
            CarePulse
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="sub-container max-w-md">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-14-regular">Back to login</span>
          </button>

          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <KeyRound className="w-8 h-8 text-green-500 dark:text-green-400" />
              <span className="text-18-bold text-green-500 dark:text-green-400">
                Password Recovery
              </span>
            </div>
            <h1 className="text-36-bold text-gray-900 dark:text-gray-100 mb-2">
              {step === "email" && "Forgot Password?"}
              {step === "verification" && "Verify Code"}
              {step === "reset" && "Reset Password"}
            </h1>
            <p className="text-16-regular text-gray-600 dark:text-gray-400">
              {step === "email" &&
                "Enter your email address and we'll send you a verification code"}
              {step === "verification" &&
                "Enter the 6-digit code sent to your email"}
              {step === "reset" &&
                "Create a new secure password for your account"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-14-semibold transition-all ${
                step === "email"
                  ? "bg-green-500 dark:bg-green-600 text-white"
                  : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              }`}
            >
              1
            </div>
            <div
              className={`w-12 h-1 rounded transition-all ${
                step !== "email"
                  ? "bg-green-500 dark:bg-green-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-14-semibold transition-all ${
                step === "verification"
                  ? "bg-green-500 dark:bg-green-600 text-white"
                  : step === "reset"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
              }`}
            >
              2
            </div>
            <div
              className={`w-12 h-1 rounded transition-all ${
                step === "reset"
                  ? "bg-green-500 dark:bg-green-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-14-semibold transition-all ${
                step === "reset"
                  ? "bg-green-500 dark:bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
              }`}
            >
              3
            </div>
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-14-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setMessage("");
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    messageType === "success"
                      ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-14-regular">{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg text-16-semibold transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === "verification" && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-14-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-center">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setVerificationCode(value);
                      setMessage("");
                    }}
                    placeholder="000000"
                    className="w-full text-center text-24-bold tracking-widest py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-12-regular text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Code sent to {email}
                </p>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    messageType === "success"
                      ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-14-regular">{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg text-16-semibold transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || isLoading}
                  className="text-14-regular text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend verification code"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-14-medium text-gray-700 dark:text-gray-300 mb-2">
                  New password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setMessage("");
                    }}
                    placeholder="Enter your new password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-12-regular text-gray-500 dark:text-gray-400">
                        Password Strength
                      </span>
                      {passwordStrength.label && (
                        <span
                          className={`text-12-semibold ${
                            passwordStrength.label === "Weak"
                              ? "text-red-500 dark:text-red-400"
                              : passwordStrength.label === "Medium"
                                ? "text-yellow-500 dark:text-yellow-400"
                                : "text-green-500 dark:text-green-400"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {newPassword && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                    <p className="text-12-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Password Requirements:
                    </p>

                    <div
                      className={`flex items-center gap-2 text-12-regular ${
                        passwordRequirements.minLength
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {passwordRequirements.minLength ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>At least 8 characters</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-12-regular ${
                        passwordRequirements.hasUppercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {passwordRequirements.hasUppercase ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>One uppercase letter (A-Z)</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-12-regular ${
                        passwordRequirements.hasLowercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {passwordRequirements.hasLowercase ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>One lowercase letter (a-z)</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-12-regular ${
                        passwordRequirements.hasNumber
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {passwordRequirements.hasNumber ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>One number (0-9)</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-12-regular ${
                        passwordRequirements.hasSpecialChar
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {passwordRequirements.hasSpecialChar ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>One special character (!@#$%^&*)</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-14-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setMessage("");
                    }}
                    placeholder="Confirm your new password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-12-regular text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-12-regular text-green-500 dark:text-green-400 mt-1 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </div>

              {message && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    messageType === "success"
                      ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-14-regular">{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !allRequirementsMet ||
                  newPassword !== confirmPassword
                }
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg text-16-semibold transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* Info Box */}
          {step === "email" && (
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
              <h3 className="text-16-semibold text-blue-900 dark:text-blue-300 mb-3">
                Need Help?
              </h3>
              <ul className="space-y-2 text-14-regular text-blue-700 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Make sure to check your spam folder for the verification code
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  The code will expire after 10 minutes
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Contact support if you don't receive the code
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
