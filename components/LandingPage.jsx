import React from "react";
import {
  Plus,
  Calendar,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Heart,
  Stethoscope,
  Phone,
  Award,
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

const LandingPage = ({
  onGetStarted,
  onAdminAccess,
  onBookAppointment,
}) => {
  return (
    <div className="min-h-screen bg-dark-300">
      {/* Header */}
      <header className="bg-dark-200 border-b border-dark-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-24-bold text-white">CarePulse</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-14-regular text-dark-700 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-14-regular text-dark-700 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-14-regular text-dark-700 hover:text-white transition-colors"
              >
                Contact
              </a>
              <button
                onClick={onAdminAccess}
                className="text-14-regular text-dark-700 hover:text-white transition-colors"
              >
                Admin
              </button>
              <button
                onClick={onGetStarted}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-14-medium transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={onBookAppointment}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-14-medium transition-colors"
              >
                Book Appointment
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-36-bold md:text-[48px] md:leading-[52px] text-white mb-6">
                Your Health,{" "}
                <span className="text-green-500">Our Priority</span>
              </h1>
              <p className="text-18-bold text-dark-700 mb-8 leading-relaxed">
                Experience seamless healthcare management with CarePulse. Book
                appointments, manage your health records, and connect with
                healthcare professionals all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-16-semibold transition-colors flex items-center gap-2 justify-center"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onBookAppointment}
                  className="border border-dark-500 text-white px-8 py-4 rounded-lg text-16-semibold hover:bg-dark-400 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-dark-400 rounded-2xl p-8 border border-dark-500">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Healthcare professionals"
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-32-bold lg:text-[40px] lg:leading-[44px] text-green-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-16-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-12-regular text-dark-700">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-400">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-32-bold text-white mb-4">
              Comprehensive Healthcare Features
            </h2>
            <p className="text-16-regular text-dark-700 max-w-2xl mx-auto">
              Our platform provides everything you need for complete healthcare
              management, from appointment booking to prescription tracking and
              medical records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-dark-300 p-8 rounded-2xl border border-dark-500 hover:border-green-500 transition-colors group"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-18-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-14-regular text-dark-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features by Role */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-32-bold text-white mb-4">
              Built for Every Healthcare Role
            </h2>
            <p className="text-16-regular text-dark-700 max-w-2xl mx-auto">
              CarePulse provides specialized dashboards and features tailored
              for each role in the healthcare ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {platformFeatures.map((platform, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${platform.color} backdrop-blur-sm border border-opacity-20 rounded-3xl p-8`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{platform.icon}</div>
                  <div>
                    <h3 className="text-20-bold text-white">
                      {platform.title}
                    </h3>
                    <p className="text-14-regular text-dark-700">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {platform.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-14-regular text-white">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-400">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-32-bold text-white mb-4">
              Our Medical Departments
            </h2>
            <p className="text-16-regular text-dark-700 max-w-2xl mx-auto">
              Access specialized care across multiple medical departments with
              expert healthcare professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-dark-300 p-8 rounded-2xl border border-dark-500 hover:border-green-500 transition-colors"
              >
                <div className="text-4xl mb-6">{dept.icon}</div>
                <h3 className="text-18-bold text-white mb-4">{dept.name}</h3>
                <p className="text-14-regular text-dark-700 mb-4">
                  {dept.description}
                </p>
                <div className="flex items-center gap-4 text-12-regular text-green-400 mb-4">
                  <span>{dept.doctors} Doctors</span>
                  <span>•</span>
                  <span>{dept.specialties.length} Specialties</span>
                </div>
                <div className="space-y-1">
                  {dept.specialties.map((specialty, specIndex) => (
                    <div
                      key={specIndex}
                      className="text-12-regular text-dark-600"
                    >
                      • {specialty}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-32-bold text-white mb-4">
              Choose Your Healthcare Plan
            </h2>
            <p className="text-16-regular text-dark-700 max-w-2xl mx-auto">
              Select the perfect plan that fits your healthcare needs and
              budget.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-dark-300 rounded-2xl border p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-green-500 shadow-lg shadow-green-500/25 scale-105"
                    : "border-dark-500 hover:border-green-500"
                }`}
              >
                {plan.popular && (
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-12-medium text-center mb-6">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-24-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-36-bold text-green-500">
                      {plan.price}
                    </span>
                    <span className="text-14-regular text-dark-700">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-14-regular text-dark-700">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-14-regular text-white">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 px-6 rounded-lg text-16-semibold transition-colors ${
                    plan.popular
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Healthcare Benefits */}
          <div className="mt-16 bg-dark-300 rounded-2xl p-8 border border-dark-500">
            <div className="flex items-center gap-3 mb-6">
              <Stethoscope className="w-8 h-8 text-green-500" />
              <h3 className="text-24-bold text-white">Why Choose CarePulse?</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {healthcareBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <p
                    className="text-14-regular text-dark-700"
                    dangerouslySetInnerHTML={{ __html: benefit }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Healthcare consultation"
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
            <div>
              <h2 className="text-32-bold text-white mb-6">
                Complete Healthcare Ecosystem
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-16-semibold text-white mb-1">
                      Consultation Management
                    </h4>
                    <p className="text-14-regular text-dark-700">
                      Complete consultation workflow from booking to
                      prescription management with detailed medical records.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-16-semibold text-white mb-1">
                      Prescription Tracking
                    </h4>
                    <p className="text-14-regular text-dark-700">
                      Track all your medications from doctor consultations with
                      refill management and pharmacy integration.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-16-semibold text-white mb-1">
                      Multi-Role Platform
                    </h4>
                    <p className="text-14-regular text-dark-700">
                      Specialized dashboards for patients, doctors, pharmacists,
                      receptionists, and administrators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-400">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-32-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-16-regular text-dark-700 max-w-2xl mx-auto">
              Hear from patients, doctors, and healthcare professionals who use
              CarePulse daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-dark-300 p-8 rounded-2xl border border-dark-500 hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-16-semibold text-white">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-16-semibold text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-12-regular text-green-400">
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
                <p className="text-14-regular text-dark-700">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-32-bold text-white mb-4">
            Ready to Experience Modern Healthcare?
          </h2>
          <p className="text-16-regular text-dark-700 mb-8">
            Join thousands of patients, doctors, and healthcare professionals
            who trust CarePulse for comprehensive healthcare management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-16-semibold transition-colors inline-flex items-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onBookAppointment}
              className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-4 rounded-lg text-16-semibold transition-colors inline-flex items-center gap-2"
            >
              Book Appointment
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-200 border-t border-dark-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-18-bold text-white">CarePulse</span>
            </div>
            <div className="flex items-center gap-6 text-14-regular text-dark-700">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Us</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-dark-500 text-center">
            <p className="copyright">
              © 2024 CarePulse. All rights reserved. | Healthcare Management
              Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
