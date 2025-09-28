"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Stethoscope,
} from "lucide-react";
import {
  features,
  testimonials,
  departments,
  stats,
  platformFeatures,
} from "@/data";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { db } from "@/lib/dbConfig";
import { Users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ModeToggle } from "./ThemeButton";

const LandingPage = ({ onGetStarted, onBookAppointment }) => {
  const [role, setRole] = useState("patient");
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const data = await db
        .select()
        .from(Users)
        .where(eq(Users.email, user?.email));
      if (data.length > 0) setRole(data[0].role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-emerald-200 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={"/"} className="flex items-center gap-2">
              <Image src={"/logo.png"} alt="Logo" width={32} height={32} />
              <span className="text-24-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                MediCura
              </span>
            </Link>

            {/* Navbar */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href={"#features"}
                className="text-sm text-emerald-700 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href={"#testimonials"}
                className="text-sm text-emerald-700 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors"
              >
                Reviews
              </Link>
              <Link href={"/admin"}>
                <button className="text-sm text-emerald-700 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors">
                  Admin
                </button>
              </Link>

              {/* Auth state buttons */}
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Welcome, <span className="font-semibold">{user.name}</span>
                  </span>
                  <Link href={`/${role}/dashboard`}>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-3xl text-sm font-medium shadow-lg hover:shadow-emerald-400/25 transition-all">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-3xl text-sm font-medium shadow-lg hover:shadow-red-400/25 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href={"/sign-up"}>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-3xl text-sm font-medium shadow-lg hover:shadow-emerald-400/25 transition-all">
                      Get Started
                    </button>
                  </Link>
                  <Link href={"/sign-in"}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-3xl text-sm font-medium shadow-lg hover:shadow-blue-400/25 transition-all">
                      Login
                    </button>
                  </Link>
                </div>
              )}
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <Stethoscope className="w-4 h-4 mr-2" />
                Healthcare made simple
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                Connect with doctors <br />
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  anytime, anywhere
                </span>
              </h1>
              <p className="text-slate-700 dark:text-slate-400 text-lg max-w-md leading-relaxed">
                Book appointments, consult via video, and manage your healthcare
                journey all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-emerald-400/25 transition-all flex items-center gap-2 justify-center"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onBookAppointment}
                  className="border border-emerald-400 dark:border-slate-600 text-emerald-600 dark:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-100 dark:hover:bg-slate-800 transition-all"
                >
                  Book Appointment
                </button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-100 dark:from-emerald-900/20 to-emerald-50 dark:to-slate-800/20 rounded-2xl p-8 border border-emerald-200 dark:border-slate-700/50 h-full">
                <img
                  src="/banner.png"
                  alt="Healthcare professionals"
                  className="w-full h-full object-fit rounded-xl shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-200/40 dark:bg-emerald-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-100/40 dark:bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {stat.label}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 bg-emerald-50 dark:bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <div className="inline-flex px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
            How It Works
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Comprehensive Healthcare Features
          </h2>
          <p className="text-slate-700 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Our platform makes healthcare accessible with just a few clicks
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-900/20 rounded-xl p-6 transition hover:border-emerald-400 dark:hover:border-emerald-700/50"
            >
              <div className="bg-emerald-100 dark:bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {f.title}
              </h3>
              <p className="text-slate-700 dark:text-slate-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features by Role */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Built for Every Healthcare Role
          </h2>
          <p className="text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
            MediCura provides specialized dashboards tailored for each role.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
          {platformFeatures.map((p, i) => (
            <div
              key={i}
              className={`bg-gradient-to-r ${p.color} border border-emerald-200 dark:border-emerald-900/20 rounded-2xl p-8`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{p.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-400">
                    {p.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {p.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-900 dark:text-white text-sm">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-emerald-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Our Medical Departments
          </h2>
          <p className="text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
            Access specialized care across multiple medical fields.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {departments.map((d, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-slate-700/50 rounded-2xl p-8 hover:border-emerald-400 dark:hover:border-emerald-700/50 transition"
            >
              <div className="text-4xl mb-6">{d.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {d.name}
              </h3>
              <p className="text-slate-700 dark:text-slate-400 mb-4">
                {d.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-emerald-600 dark:text-emerald-400 mb-4">
                <span>{d.doctors} Doctors</span>•
                <span>{d.specialties.length} Specialties</span>
              </div>
              <div className="space-y-1">
                {d.specialties.map((s, si) => (
                  <div
                    key={si}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    • {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 bg-emerald-50 dark:bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <div className="inline-flex px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/30 text-emerald-600 dark:text-emerald-400 text-sm mb-4">
            Success Stories
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
            Hear from patients, doctors, and healthcare professionals.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-900/20 rounded-xl p-6 hover:border-emerald-400 dark:hover:border-emerald-700/50 transition"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mr-4">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {t.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-400">
                &quot;{t.quote}&quot;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-100 dark:from-emerald-900/30 to-emerald-50 dark:to-emerald-950/20 border border-emerald-200 dark:border-emerald-800/20 rounded-2xl p-12 relative overflow-hidden">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to take control of your healthcare?
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-400 mb-8 max-w-2xl">
              Join thousands of users who have simplified their healthcare
              journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-emerald-400/25 transition flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onBookAppointment}
                className="border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition flex items-center gap-2"
              >
                Book Appointment
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-emerald-200 dark:border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href={"/"} className="flex items-center gap-2 mb-4">
              <Image src={"/logo.png"} alt="Logo" width={32} height={32} />
              <span className="text-24-bold text-slate-900 dark:text-white">
                MediCura
              </span>
            </Link>
            <p className="text-slate-700 dark:text-slate-400 mb-4 max-w-md">
              Comprehensive healthcare management platform connecting patients,
              doctors, pharmacists, and administrators.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-700 dark:text-slate-400">
              <span>© {new Date().getFullYear()} MediCura</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
              <li>
                <Link
                  href={"#features"}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href={"#testimonials"}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin"}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
