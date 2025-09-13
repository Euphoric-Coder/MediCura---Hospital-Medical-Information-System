"use client";

import React, { useState } from "react";
import {
  Plus,
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  ChevronDown,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signUp } from "@/lib/auth";
import RedirectPage from "./RedirectPage";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "patient", // default role
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signUp({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (!res.success) {
      toast.error(res.error || "Sign up failed, please try again.");
      setError(res.error);
      return;
    }

    // Auto login after sign up
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Login failed, please try again.");
      setError("Login failed, please try again.");
    } else {
      router.push(`/${formData.role}/dashboard`);
    }
  };

  return (
    <RedirectPage>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 bg-dark-300">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-24-bold text-white">MediCura</span>
            </div>

            {/* Welcome Text */}
            <div className="mb-10">
              <h1 className="text-36-bold text-white mb-2">Hi there 👋</h1>
              <p className="text-16-regular text-dark-700">
                Create your account and get started.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="shad-input-label block mb-2">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-dark-600" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Adrian Hajdin"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="shad-input-label block mb-2">Role</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                  >
                    <span className="text-white">
                      {formData.role.charAt(0).toUpperCase() +
                        formData.role.slice(1)}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-dark-600 transition-transform ${
                        showRoleDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Role Dropdown */}
                  {showRoleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-3 border-b border-dark-500">
                        <span className="text-14-medium text-dark-700">
                          Select Role
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {[
                          "patient",
                          "doctor",
                          "pharmacist",
                          "receptionist",
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, role }));
                              setShowRoleDropdown(false);
                            }}
                            className="w-full p-4 flex items-center justify-between hover:bg-dark-500 transition-colors text-left"
                          >
                            <span className="text-16-medium text-white capitalize">
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </span>
                            {formData.role === role && (
                              <Check className="w-5 h-5 text-green-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="shad-input-label block mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-dark-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="adrian@jsmastery.pr"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="shad-input-label block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-600" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors mt-8"
              >
                Get Started
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <span className="text-14-regular text-dark-600">
                Already have an account?{" "}
              </span>
              <button
                onClick={() => router.push("/sign-in")}
                className="text-14-regular text-green-500 hover:text-green-400 transition-colors"
              >
                Sign in
              </button>
            </div>

            {/* Back Link */}
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-14-regular text-dark-600 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Healthcare professional with stethoscope"
            className="side-img w-full max-h-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-dark-300/20"></div>
        </div>
      </div>
    </RedirectPage>
  );
};

export default LoginPage;
