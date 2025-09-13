"use client";

import React, { useState } from "react";
import { Plus, User, Mail, Phone, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signUp } from "@/lib/auth";
import RedirectPage from "./RedirectPage";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
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
    });

    if (!res.success) {
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
      setError("Login failed, please try again.");
    } else {
      router.push("/dashboard");
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
              <h1 className="text-36-bold text-white mb-2">Hi there, ....</h1>
              <p className="text-16-regular text-dark-700">
                Get Started with Appointments.
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

              {/* Phone Number (not stored yet) */}
              <div>
                <label className="shad-input-label block mb-2">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-dark-600" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+00 0342 0453 34"
                    className="shad-input pl-10 w-full text-white"
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
