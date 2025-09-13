import React, { useState } from "react";
import { Plus, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in form submitted:", formData);
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 bg-dark-300">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-24-bold text-white">CarePulse</span>
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
              {/* Email */}
              <div>
                <label className="shad-input-label block mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-dark-600" />
                  </div>
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-dark-600" />
                  </div>
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

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-14-regular text-green-500 hover:text-green-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors mt-8"
              >
                Sign In
              </button>
            </form>

            {/* Sign In Link */}
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

            {/* Back Link */}
            <button
              //   onClick={onBack}
              className="mt-6 text-14-regular text-dark-600 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>

            {/* Copyright */}
            <div className="mt-16">
              <p className="copyright">©carepulse copyright</p>
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

          {/* Overlay for better text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-dark-300/20"></div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
