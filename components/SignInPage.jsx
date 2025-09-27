"use client";

import React, { useState } from "react";
import { Mail, Lock, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import RedirectPage from "./RedirectPage";
import { toast } from "sonner";
import { Users } from "@/lib/schema";
import { db } from "@/lib/dbConfig";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

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
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (!session?.user) {
        setError("Could not fetch user session.");
        await signOut({ redirect: false });
        return;
      }

      const UserRole = await db
        .select()
        .from(Users)
        .where(eq(Users.email, formData.email))
        .limit(1);

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
    <RedirectPage redirectTo={`/${formData.role}/dashboard`}>
      <div className="min-h-screen flex bg-white dark:bg-dark-300 transition-colors">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link href={"/"}>
              <div className="flex items-center gap-2 mb-12">
                <Image src={"/logo.png"} alt="Logo" width={32} height={32} />
                <span className="text-24-bold text-slate-900 dark:text-white">
                  MediCura
                </span>
              </div>
            </Link>

            {/* Welcome Text */}
            <div className="mb-10">
              <h1 className="text-36-bold text-slate-900 dark:text-white mb-2">
                Welcome back
              </h1>
              <p className="text-16-regular text-slate-600 dark:text-dark-700">
                Sign in to your account to continue.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Dropdown */}
              <div>
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg px-4 py-3 text-left text-slate-900 dark:text-white flex items-center justify-between hover:border-emerald-500 transition-colors"
                  >
                    <span className="capitalize">{formData.role}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 dark:text-dark-600 transition-transform ${
                        showRoleDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showRoleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-3 border-b border-slate-200 dark:border-dark-500">
                        <span className="text-14-medium text-slate-600 dark:text-dark-700">
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
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-dark-500 transition-colors text-left"
                          >
                            <span className="text-16-medium text-slate-900 dark:text-white capitalize">
                              {role}
                            </span>
                            {formData.role === role && (
                              <Check className="w-5 h-5 text-emerald-500" />
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
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-dark-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="adrian@jsmastery.pr"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-dark-600" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors mt-8"
              >
                Sign In
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <span className="text-14-regular text-slate-600 dark:text-dark-600">
                Don't have an account?{" "}
              </span>
              <button
                onClick={() => router.push("/sign-up")}
                className="text-14-regular text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
          <img
            src="/login.png"
            alt="Healthcare professional with stethoscope"
            className="side-img max-h-screen w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/40 dark:to-dark-300/20"></div>
        </div>
      </div>
    </RedirectPage>
  );
};

export default SignInPage;
