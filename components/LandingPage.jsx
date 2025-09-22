import React, { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  UsersIcon as UsersIcon,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Heart,
  Stethoscope,
  Phone,
  Award,
  Pill,
  TestTube,
  FileText,
  CreditCard,
  Bell,
} from "lucide-react";
import {
  features,
  testimonials,
  pricingPlans,
  healthcareBenefits,
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

      if (data.length > 0) {
        setRole(data[0].role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={"/"} className="flex items-center gap-2">
              <Image src={"/logo.png"} alt="Logo" width={32} height={32} />
              <span className="text-24-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                MediCura
              </span>
            </Link>

            {/* Navbar */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href={"#features"}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href={"#testimonials"}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Reviews
              </Link>
              <Link href={"/admin"}>
                <button className="text-sm text-slate-400 hover:text-white transition-colors">
                  Admin
                </button>
              </Link>

              {/* Auth state buttons */}
              {user ? (
                <div className="flex items-center gap-4">
                  {/* Welcome Message */}
                  <span className="text-sm text-slate-300">
                    Welcome, <span className="font-semibold">{user.name}</span>
                  </span>

                  {/* Dashboard */}
                  <Link href={`/${role}/dashboard`}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-3xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
                      Dashboard
                    </button>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={() => signOut()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-3xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href={"/sign-up"}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-3xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
                      Get Started
                    </button>
                  </Link>
                  <Link href={"/sign-in"}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-3xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                      Login
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-sm font-medium">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Healthcare made simple
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Connect with doctors <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    anytime, anywhere
                  </span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-md leading-relaxed">
                  Book appointments, consult via video, and manage your
                  healthcare journey all in one secure platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={onGetStarted}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 justify-center"
                  >
                    Get Started Today
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onBookAppointment}
                    className="border border-slate-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-all duration-300"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

              <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-900/20 to-slate-800/20 rounded-2xl p-8 border border-slate-700/50 h-full">
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
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-sm font-medium mb-4">
                How It Works
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comprehensive Healthcare Features
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Our platform makes healthcare accessible with just a few clicks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm border border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 rounded-xl p-6 group"
                >
                  <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4 group-hover:bg-emerald-900/30 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features by Role */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Built for Every Healthcare Role
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                MediCura provides specialized dashboards and features tailored
                for each role in the healthcare ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {platformFeatures.map((platform, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${platform.color} backdrop-blur-sm border border-emerald-900/20 rounded-2xl p-8`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{platform.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {platform.title}
                      </h3>
                      <p className="text-slate-400">{platform.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {platform.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-sm font-medium mb-4">
                Affordable Healthcare
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Healthcare Plans
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Choose the perfect plan that fits your healthcare needs and
                budget
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border p-8 transition-all duration-300 ${
                    plan.popular
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/25 scale-105"
                      : "border-slate-700/50 hover:border-emerald-700/50"
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium text-center mb-6">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-2 mb-4">
                      <span className="text-4xl font-bold text-emerald-400">
                        {plan.price}
                      </span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                    <p className="text-slate-400">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={onGetStarted}
                    className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition-colors ${
                      plan.popular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Departments Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Medical Departments
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Access specialized care across multiple medical departments with
                expert healthcare professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-emerald-700/50 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-6">{dept.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-slate-400 mb-4">{dept.description}</p>
                  <div className="flex items-center gap-4 text-sm text-emerald-400 mb-4">
                    <span>{dept.doctors} Doctors</span>
                    <span>•</span>
                    <span>{dept.specialties.length} Specialties</span>
                  </div>
                  <div className="space-y-1">
                    {dept.specialties.map((specialty, specIndex) => (
                      <div key={specIndex} className="text-sm text-slate-500">
                        • {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-sm font-medium mb-4">
                Success Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Our UsersIcon Say
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Hear from patients, doctors, and healthcare professionals who
                use MediCura daily.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm border border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mr-4">
                      <span className="text-emerald-400 font-bold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-emerald-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-400">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border border-emerald-800/20 rounded-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to take control of your healthcare?
                </h2>
                <p className="text-lg text-slate-400 mb-8">
                  Join thousands of users who have simplified their healthcare
                  journey with our platform. Get started today and experience
                  healthcare the way it should be.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={onGetStarted}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 justify-center"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onBookAppointment}
                    className="border border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2 justify-center"
                  >
                    Book Appointment
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Decorative healthcare elements */}
              <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-800/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-700/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Link href={"/"}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={"/logo.png"}
                      alt="Logo"
                      width={32}
                      height={32}
                    />
                    <span className="text-24-bold text-white">MediCura</span>
                  </div>
                </Link>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Comprehensive healthcare management platform connecting
                patients, doctors, pharmacists, and healthcare administrators.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>© {new Date().getFullYear()} MediCura</span>
                <span>•</span>
                <span>All rights reserved</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    href={"#features"}
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href={"#pricing"}
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href={"#testimonials"}
                    className="hover:text-white transition-colors"
                  >
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href={"/admin"}>
                    <button className="hover:text-white transition-colors">
                      Admin Portal
                    </button>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
