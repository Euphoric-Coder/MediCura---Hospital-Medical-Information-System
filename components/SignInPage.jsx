"use client";

import React, { useState } from "react";
import { Plus, Mail, Lock, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import RedirectPage from "./RedirectPage";
import { toast } from "sonner";
import { Users } from "@/lib/schema";
import { db } from "@/lib/dbConfig";
import { eq } from "drizzle-orm";

const SignInPage = () => {
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
      setError("Invalid email or password");
      return;
    }

    try {
      // Fetch session/user details from /api/auth/session
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (!session?.user) {
        setError("Could not fetch user session.");
        await signOut({ redirect: false });
        return;
      }

      const UserRole = await db.select().from(Users).where(eq(Users.email, formData.email)).limit(1);

      if (formData.role !== UserRole[0].role) {
        setError("Role mismatch. Please select the correct role.");
        toast.error("Role mismatch. Please select the correct role.");
        await signOut({ redirect: false });
        return;
      }

      router.push(`/${formData.role}/dashboard`);
    } catch (err) {
      console.error("Error checking user role:", err);
      setError("Something went wrong, please try again.");
      await signOut({ redirect: false });
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
              <h1 className="text-36-bold text-white mb-2">Welcome back</h1>
              <p className="text-16-regular text-dark-700">
                Sign in to your account to continue.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Dropdown */}
              <div>
                <label className="shad-input-label block mb-2">Role</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                  >
                    <span className="text-white capitalize">
                      {formData.role}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-dark-600 transition-transform ${
                        showRoleDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

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
                              {role}
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
                    placeholder="Enter your password"
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
                Sign In
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <span className="text-14-regular text-dark-600">
                Don't have an account?{" "}
              </span>
              <button
                onClick={() => router.push("/sign-up")}
                className="text-14-regular text-green-500 hover:text-green-400 transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Healthcare professional with stethoscope"
            className="side-img max-h-screen w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-dark-300/20"></div>
        </div>
      </div>
    </RedirectPage>
  );
};

export default SignInPage;
