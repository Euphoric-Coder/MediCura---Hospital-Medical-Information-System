"use client";

import React from "react";
import {
  Plus,
  Home,
  ArrowLeft,
  Search,
  Stethoscope,
  Heart,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = ({ onBackToHome }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={"/"} className="flex items-center gap-2">
              <Image src={"/logo.png"} alt="Logo" width={32} height={32} />
              <span className="text-24-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                MediCura
              </span>
            </Link>
            <Link href={"/"}>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Visual */}
          <div className="relative mb-12">
            {/* Large 404 Text */}
            <div className="text-[12rem] md:text-[16rem] font-bold text-slate-800/20 leading-none select-none">
              404
            </div>

            {/* Floating Medical Icons */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Center Stethoscope */}
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 animate-pulse">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>

                {/* Floating Icons */}
                <div
                  className="absolute -top-8 -left-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </div>

                <div
                  className="absolute -top-8 -right-8 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "1s" }}
                >
                  <Calendar className="w-6 h-6 text-white" />
                </div>

                <div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "1.5s" }}
                >
                  <Search className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-6 mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-sm font-medium mb-4">
              <Stethoscope className="w-4 h-4 mr-2" />
              Page Not Found
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Oops! This page seems to have <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                gone for a check-up
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back to managing your healthcare journey.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={"/"}>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 justify-center">
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </Link>

            <button
              onClick={() => router.back()}
              className="border border-slate-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              Popular Pages
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={onBackToHome}
                className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-4 text-left transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">
                    Book Appointment
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  Schedule your next consultation
                </p>
              </button>

              <button
                onClick={onBackToHome}
                className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 rounded-xl p-4 text-left transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Stethoscope className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">Find Doctors</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Browse our medical professionals
                </p>
              </button>

              <button
                onClick={onBackToHome}
                className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-4 text-left transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Heart className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white font-medium">Health Records</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Access your medical history
                </p>
              </button>
            </div>
          </div>

          {/* Support Information */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm mb-4">
              Need help? Our support team is here for you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@carepulse.com"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                support@carepulse.com
              </a>
              <span className="hidden sm:inline text-slate-600">•</span>
              <a
                href="tel:+1-555-123-4567"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                +1 (555) 123-4567
              </a>
              <span className="hidden sm:inline text-slate-600">•</span>
              <button
                onClick={onBackToHome}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Help Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute right-0 top-1/4 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-3xl -mr-20"></div>
      <div className="absolute left-0 bottom-1/4 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-3xl -ml-10"></div>
    </div>
  );
};

export default NotFound;
