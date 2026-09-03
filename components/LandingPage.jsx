import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { db } from "@/lib/dbConfig";
import { Users as UsersTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  Plus,
  Calendar,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Stethoscope,
  Award,
  Pill,
  TestTube,
  FileText,
  CreditCard,
  Bell,
  Activity,
  ChevronDown,
  Menu,
  X,
  UserPlus,
  Sparkles,
  Zap,
  Lock,
  TrendingUp,
  Phone,
  Mail,
  ArrowUp,
  ExternalLink,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  LogIn,
} from "lucide-react";
import {
  features,
  testimonials,
  pricingPlans,
  departments,
  stats,
  platformFeatures,
} from "@/lib/data";
import { ModeToggle } from "./ThemeButton";

/* icon registry */
const iconMap = {
  Calendar: <Calendar className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Pill: <Pill className="w-5 h-5" />,
  TestTube: <TestTube className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
};

/* stat parser  */
function parseStat(raw) {
  const cleaned = raw.replace(/,/g, "");
  const num = parseFloat(cleaned);
  const suffix = raw.replace(/[\d.,]/g, "");
  const decimals = (cleaned.split(".")[1] ?? "").length;
  return { value: num, suffix, decimals };
}
function formatNum(n, decimals) {
  return n >= 1000
    ? n.toLocaleString("en-US", { maximumFractionDigits: decimals })
    : n.toFixed(decimals);
}

/* ─── count-up hook ─────────────────────────────────────────────────────────── */
function useCountUp(end, decimals, duration = 1800) {
  const [count, setCount] = useState(0);
  const [fired, setFired] = useState(false);
  const elRef = useRef(null);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !fired) setFired(true);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fired]);
  useEffect(() => {
    if (!fired) return;
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setCount(parseFloat((e * end).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [fired, end, decimals, duration]);
  return { count, elRef };
}

/* ─── scroll-reveal hook ────────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible: vis };
}

/* sub-components */
const EkgLine = () => (
  <svg
    viewBox="0 0 400 80"
    className="absolute inset-0 w-full h-full opacity-[0.05] dark:opacity-[0.05] pointer-events-none"
    preserveAspectRatio="none"
  >
    <path
      d="M0,40 L70,40 L80,38 L86,42 L100,15 L107,65 L115,40 L122,33 L128,40 L155,28 L165,40 L240,40 L250,38 L256,42 L270,15 L277,65 L285,40 L292,33 L298,40 L325,28 L335,40 L400,40"
      fill="none"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        strokeDasharray: 900,
        strokeDashoffset: 900,
        animation: "ekg-draw 3s ease forwards",
      }}
    />
  </svg>
);

const SparklineChart = () => {
  const pts = [35, 55, 40, 65, 45, 70, 55, 80, 60, 75, 65, 85];
  const max = Math.max(...pts),
    min = Math.min(...pts);
  const norm = (v) => 38 - ((v - min) / (max - min)) * 32;
  const w = 120 / (pts.length - 1);
  const d = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${i * w},${norm(v)}`)
    .join(" ");
  return (
    <svg viewBox="0 0 120 40" className="w-full h-8">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${(pts.length - 1) * w},40 L0,40 Z`} fill="url(#spark)" />
      <path
        d={d}
        fill="none"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const StatCard = ({ value, suffix, decimals, label, description }) => {
  const { count, elRef } = useCountUp(value, decimals);
  return (
    <div ref={elRef} className="text-center group cursor-default">
      <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform duration-300">
        {formatNum(count, decimals)}
        {suffix}
      </div>
      <div className="text-base font-semibold text-slate-800 dark:text-white mb-1">
        {label}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-500">
        {description}
      </div>
    </div>
  );
};

const FeatureCard = ({ feature, span = "", large = false }) => (
  <div
    className={`group relative rounded-2xl border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-900/60 backdrop-blur-sm hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:shadow-none shadow-emerald-100 overflow-hidden ${span} ${large ? "p-8" : "p-6"}`}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-emerald-500/8 via-teal-500/4 to-transparent transition-opacity duration-500" />
    <div className="relative">
      <div
        className={`${large ? "w-14 h-14" : "w-11 h-11"} rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300 text-emerald-600 dark:text-emerald-400`}
      >
        {iconMap[feature.icon] || <Activity className="w-5 h-5" />}
      </div>
      <h3
        className={`font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 ${large ? "text-xl" : "text-base"}`}
      >
        {feature.title}
      </h3>
      <p
        className={`text-slate-600 dark:text-slate-400 leading-relaxed ${large ? "text-[15px] max-w-sm" : "text-sm"}`}
      >
        {feature.description}
      </p>
    </div>
  </div>
);

/* ─── trust badge data ──────────────────────────────────────────────────────── */
const trustBadges = [
  { icon: <Shield className="w-4 h-4" />, label: "HIPAA Compliant" },
  { icon: <Lock className="w-4 h-4" />, label: "SSL Encrypted" },
  { icon: <Award className="w-4 h-4" />, label: "ISO 27001" },
  { icon: <Zap className="w-4 h-4" />, label: "99.9% Uptime" },
  { icon: <Shield className="w-4 h-4" />, label: "SOC 2 Type II" },
  { icon: <TrendingUp className="w-4 h-4" />, label: "10K+ Patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "150+ Doctors" },
  { icon: <Star className="w-4 h-4" />, label: "4.9 / 5 Rating" },
];

const roleConfig = [
  {
    border: "border-emerald-500/30 dark:border-emerald-500/25",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/8",
    check: "text-emerald-600 dark:text-emerald-400",
    tab: "bg-emerald-500",
    hover: "hover:border-emerald-500/40 dark:hover:border-emerald-500/30",
  },
  {
    border: "border-sky-500/30 dark:border-sky-500/25",
    bg: "bg-sky-500/10 dark:bg-sky-500/8",
    check: "text-sky-600 dark:text-sky-400",
    tab: "bg-sky-500",
    hover: "hover:border-sky-500/40 dark:hover:border-sky-500/30",
  },
  {
    border: "border-violet-500/30 dark:border-violet-500/25",
    bg: "bg-violet-500/10 dark:bg-violet-500/8",
    check: "text-violet-600 dark:text-violet-400",
    tab: "bg-violet-500",
    hover: "hover:border-violet-500/40 dark:hover:border-violet-500/30",
  },
  {
    border: "border-rose-500/30 dark:border-rose-500/25",
    bg: "bg-rose-500/10 dark:bg-rose-500/8",
    check: "text-rose-600 dark:text-rose-400",
    tab: "bg-rose-500",
    hover: "hover:border-rose-500/40 dark:hover:border-rose-500/30",
  },
];

const steps = [
  {
    icon: <UserPlus className="w-6 h-6" />,
    title: "Create Account",
    body: "Sign up in seconds. Choose your role — patient, doctor, or pharmacist.",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Book Appointment",
    body: "Browse certified specialists and schedule consultations in real time.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Receive Personalised Care",
    body: "Get prescriptions, lab results, and follow-ups — all in one place.",
  },
];

/* ─── footer link data ──────────────────────────────────────────────────────── */
const footerLinks = {
  Product: ["Features", "How It Works", "Pricing", "Security", "Admin Portal"],
  Resources: [
    "Help Center",
    "Documentation",
    "API Reference",
    "Status Page",
    "Blog",
  ],
  Company: [
    "About Us",
    "Careers",
    "Press Kit",
    "Privacy Policy",
    "Terms of Service",
  ],
};

/* Reveal wrapper  */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

/* MAIN COMPONENT */
const LandingPage = ({ onGetStarted, onAdminAccess, onBookAppointment }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [role, setRole] = useState("patient");
  const [roleLoading, setRoleLoading] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  const [dark, setDark] = useState(false);
  const tabsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      setRoleLoading(true);
      const data = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.email, user?.email));
      if (data.length > 0 && data[0].role) {
        setRole(data[0].role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setRoleLoading(false);
    }
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const scrollTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    [],
  );
  const handleSub = (e) => {
    e.preventDefault();
    if (email) {
      setSubDone(true);
      setEmail("");
    }
  };

  const handleGetStartedClick = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (user) {
      router.push(`/${role}/dashboard`);
    } else {
      router.push("/sign-up");
    }
  };

  const handleBookAppointmentClick = () => {
    if (onBookAppointment) {
      onBookAppointment();
    } else if (user) {
      router.push(`/${role}/dashboard`);
    } else {
      router.push("/sign-in");
    }
  };

  const handleAdminClick = () => {
    if (onAdminAccess) {
      onAdminAccess();
    } else {
      router.push("/admin");
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <style>{`
        @keyframes marquee    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes float-a    { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-12px)} }
        @keyframes float-b    { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-7px)} }
        @keyframes shimmer-x  { from{background-position:-600px 0} to{background-position:600px 0} }
        @keyframes ekg-draw   { to{stroke-dashoffset:0} }
        @keyframes glow-pulse { 0%,100%{opacity:.12} 50%{opacity:.28} }
        @keyframes spin-slow  { to{transform:rotate(360deg)} }
        .animate-marquee     { animation: marquee    22s linear infinite }
        .animate-float-a     { animation: float-a    4s  ease-in-out infinite }
        .animate-float-b     { animation: float-b    5s  ease-in-out infinite }
        .animate-glow-pulse  { animation: glow-pulse 3.5s ease-in-out infinite }
        .shimmer-text {
          background: linear-gradient(90deg,#10b981 0%,#059669 40%,#10b981 60%,#047857 100%);
          background-size: 600px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-x 4s linear infinite;
        }
        .dark .shimmer-text {
          background: linear-gradient(90deg,#6ee7b7 0%,#ffffff 40%,#6ee7b7 60%,#34d399 100%);
          background-size: 600px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-x 4s linear infinite;
        }
        .card-glow:hover      { box-shadow:0 0 48px -10px rgba(16,185,129,.2); }
        .gradient-border-card {
          background: linear-gradient(135deg,rgba(16,185,129,.10) 0%,rgba(20,184,166,.05) 100%);
          border: 1px solid rgba(16,185,129,.20);
        }
        .dark .gradient-border-card {
          background: linear-gradient(135deg,rgba(16,185,129,.16) 0%,rgba(20,184,166,.07) 100%);
          border: 1px solid rgba(16,185,129,.18);
        }
        .tabs-scroll::-webkit-scrollbar { display:none; }
        .tabs-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        @media(max-width:640px){
          .hero-float { display:none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 dark:bg-[#030912] text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">
        {/* ambient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="animate-glow-pulse absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[130px]" />
          <div
            className="animate-glow-pulse absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/7 blur-[120px]"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="animate-glow-pulse absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-teal-500/7 blur-[100px]"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.022]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.08) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 55% at 50% 0%,transparent 35%,#f8fafc 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background:
                "radial-gradient(ellipse 80% 55% at 50% 0%,transparent 35%,#030912 100%)",
            }}
          />
        </div>

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <header
          className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/85 dark:bg-[#030912]/88 backdrop-blur-2xl border-b border-slate-200 dark:border-white/[0.06] shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40" : "bg-transparent"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="flex items-center gap-3 flex-shrink-0 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Medi
                  <span className="text-emerald-500 dark:text-emerald-400">
                    Cura
                  </span>
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {[
                  ["#features", "Features"],
                  ["#how-it-works", "How It Works"],
                  ["#pricing", "Pricing"],
                  ["#testimonials", "Reviews"],
                ].map(([h, l]) => (
                  <a
                    key={h}
                    href={h}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 relative group whitespace-nowrap"
                  >
                    {l}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-500 dark:bg-emerald-400 group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
                <button
                  onClick={handleAdminClick}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group"
                >
                  Admin
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-500 dark:bg-emerald-400 group-hover:w-full transition-all duration-300" />
                </button>

                <ModeToggle />

                {/* Authentication state */}
                {status === "loading" ? (
                  <div className="w-24 h-9 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
                ) : user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-full bg-emerald-500/10 dark:bg-white/[0.05] border border-emerald-500/20 dark:border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/15 transition-all text-left group"
                      aria-expanded={userDropdownOpen}
                      aria-label="User menu"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getUserInitials(user.name)
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight max-w-[110px] truncate">
                          {user.name || "My Account"}
                        </span>
                        <span className="text-[10px] capitalize text-emerald-600 dark:text-emerald-400 leading-none">
                          {role}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* User Dropdown */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {user.email}
                          </p>
                          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                            Role: {role}
                          </div>
                        </div>

                        <Link
                          href={`/${role}/dashboard`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                          <span>Go to Dashboard</span>
                        </Link>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left mt-1 border-t border-slate-100 dark:border-slate-800/80 pt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/sign-in"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      className="relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/25 group whitespace-nowrap"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        Get Started
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
                    </Link>
                  </div>
                )}
              </nav>
              <div className="md:hidden flex items-center gap-1">
                <ModeToggle />
                <button
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-white/96 dark:bg-[#030912]/96 backdrop-blur-2xl border-t border-slate-200 dark:border-white/[0.06] px-4 pt-4 pb-6 space-y-2">
              {/* Mobile logged in user card */}
              {user && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getUserInitials(user.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {role}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/15">
                    <Link
                      href={`/${role}/dashboard`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {[
                ["#features", "Features"],
                ["#how-it-works", "How It Works"],
                ["#pricing", "Pricing"],
                ["#testimonials", "Reviews"],
              ].map(([h, l]) => (
                <a
                  key={h}
                  href={h}
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 py-2.5 px-3 rounded-lg transition-all text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {l}
                </a>
              ))}
              <button
                onClick={() => {
                  handleAdminClick();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 py-2.5 px-3 rounded-lg w-full text-left text-sm font-medium transition-all"
              >
                Admin Portal
              </button>

              {!user && (
                <div className="pt-3 pb-1 grid grid-cols-2 gap-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-center"
                  >
                    <LogIn className="w-4 h-4 text-emerald-500" />
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}
        </header>

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[calc(100svh-64px)] flex items-center py-12 md:py-16 overflow-hidden">
          <EkgLine />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* copy */}
              <div className="space-y-6 sm:space-y-8">
                <div
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium"
                  style={{ animation: "float-a 4s ease-in-out infinite" }}
                >
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Healthcare reimagined for the digital age
                </div>

                <div className="space-y-1">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight text-slate-900 dark:text-white">
                    Your health,
                  </h1>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight shimmer-text">
                    brilliantly
                  </h1>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight text-slate-900 dark:text-white">
                    managed.
                  </h1>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed">
                  Connect with world-class doctors, manage prescriptions, and
                  access your complete health record — all in one beautifully
                  secure platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {user ? (
                    <button
                      onClick={handleGetStartedClick}
                      className="group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-white px-7 py-3.5 sm:py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5 justify-center"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5" />
                        Go to {role.charAt(0).toUpperCase() +
                          role.slice(1)}{" "}
                        Dashboard
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  ) : (
                    <button
                      onClick={handleGetStartedClick}
                      className="group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-white px-7 py-3.5 sm:py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5 justify-center"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Start for free{" "}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  )}
                  <button
                    onClick={handleBookAppointmentClick}
                    className="group px-7 py-3.5 sm:py-4 rounded-xl text-base font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:border-slate-400 dark:hover:border-white/20 transition-all duration-300 flex items-center gap-2.5 justify-center backdrop-blur-sm"
                  >
                    <Calendar className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    {user ? "Book Consultation" : "Book a consultation"}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex -space-x-3">
                    {[
                      "bg-emerald-500",
                      "bg-cyan-500",
                      "bg-teal-500",
                      "bg-sky-500",
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={`w-9 h-9 rounded-full ${c} border-2 border-slate-50 dark:border-[#030912] flex items-center justify-center text-xs font-bold text-white`}
                      >
                        {["SJ", "MC", "ER", "JW"][i]}
                      </div>
                    ))}
                    <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700/80 border-2 border-slate-50 dark:border-[#030912] flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      +9k
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 text-sm">
                      <strong className="text-slate-900 dark:text-white">
                        10,000+
                      </strong>{" "}
                      patients trust MediCura
                    </span>
                  </div>
                </div>
              </div>

              {/* dashboard mockup */}
              <div className="relative flex items-center justify-center mt-4 lg:mt-0">
                <div className="animate-glow-pulse absolute inset-4 sm:inset-8 rounded-3xl border border-emerald-500/10" />
                <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-3xl" />

                <div className="relative w-full animate-float-a">
                  <div className="relative bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden shadow-2xl">
                    {/* window bar */}
                    <div className="bg-gradient-to-r from-emerald-50 to-slate-50 dark:from-emerald-950/60 dark:to-slate-900/60 px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center flex-shrink-0">
                          <Plus
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          MediCura Dashboard
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=900"
                        alt="Healthcare professionals"
                        className="w-full h-44 sm:h-56 lg:h-64 object-cover opacity-80 dark:opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-emerald-500/15 backdrop-blur-sm border border-emerald-500/25 rounded-lg px-2.5 py-1.5">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                          <span className="text-emerald-600 dark:text-emerald-300 text-[10px] sm:text-xs font-medium">
                            3 doctors available now
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
                            Next Appointment
                          </p>
                          <p className="text-slate-900 dark:text-white font-semibold mt-0.5 text-sm sm:text-base truncate">
                            Dr. Sarah Mitchell — Cardiology
                          </p>
                        </div>
                        <div className="bg-emerald-500/15 border border-emerald-500/25 rounded-lg px-2.5 py-1.5 text-right ml-3 flex-shrink-0">
                          <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                            Today
                          </p>
                          <p className="text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                            3:00 PM
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                          {
                            label: "Heart Rate",
                            val: "72",
                            unit: "bpm",
                            color: "from-emerald-500 to-teal-400",
                            bg: "bg-emerald-500/10",
                            w: "w-3/4",
                          },
                          {
                            label: "Blood Pres.",
                            val: "120/80",
                            unit: "mmHg",
                            color: "from-sky-500 to-blue-400",
                            bg: "bg-sky-500/10",
                            w: "w-2/3",
                          },
                          {
                            label: "Rx Active",
                            val: "3",
                            unit: "active",
                            color: "from-violet-500 to-purple-400",
                            bg: "bg-violet-500/10",
                            w: "w-1/2",
                          },
                        ].map((s, i) => (
                          <div
                            key={i}
                            className={`${s.bg} rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-white/5`}
                          >
                            <p className="text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] mb-1 truncate">
                              {s.label}
                            </p>
                            <p className="text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-none">
                              {s.val}
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-[9px] sm:text-[10px] mb-2">
                              {s.unit}
                            </p>
                            <div className="h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${s.w} bg-gradient-to-r ${s.color} rounded-full`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 sm:mt-4 bg-slate-100/70 dark:bg-white/[0.03] rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            Activity — last 12 days
                          </span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            +18%
                          </span>
                        </div>
                        <SparklineChart />
                      </div>
                    </div>
                  </div>

                  {/* floating shield badge — hidden on xs */}
                  <div className="hero-float absolute -top-4 -right-4 sm:-top-5 sm:-right-5 animate-float-b">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-60" />
                      <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-3.5 sm:p-4 shadow-2xl">
                        <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* floating notification — hidden on xs */}
                  <div
                    className="hero-float absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 animate-float-b"
                    style={{ animationDelay: ".8s" }}
                  >
                    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-2xl">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Lab Result Ready
                          </p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            CBC Panel — Normal
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1 flex-shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* floating pill card — only xl+ */}
                  <div
                    className="absolute top-1/2 -right-16 hidden xl:block animate-float-a"
                    style={{ animationDelay: "1.2s" }}
                  >
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Refill due
                          </p>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            Metformin 500mg
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-12 lg:mt-16 gap-2 opacity-40 dark:opacity-25">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 tracking-[0.2em] uppercase">
                Scroll to explore
              </span>
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-400 animate-bounce" />
            </div>
          </div>
        </section>

        {/* ── TRUST MARQUEE ────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-y border-slate-200 dark:border-white/[0.05] py-3.5 bg-slate-100/50 dark:bg-white/[0.012]">
          <div className="flex animate-marquee whitespace-nowrap select-none">
            {[...trustBadges, ...trustBadges].map((b, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2.5 mx-6 sm:mx-8 text-slate-500 dark:text-slate-500"
              >
                <span className="text-emerald-500 dark:text-emerald-500">
                  {b.icon}
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {b.label}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 ml-4 sm:ml-6" />
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ─────────────────────────────────────────────────────────────── */}
        <Reveal className="relative py-16 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/40 via-transparent to-cyan-100/30 dark:from-emerald-950/20 dark:via-transparent dark:to-cyan-950/15" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((s, i) => {
                const { value, suffix, decimals } = parseStat(s.number);
                return (
                  <StatCard
                    key={i}
                    value={value}
                    suffix={suffix}
                    decimals={decimals}
                    label={s.label}
                    description={s.description}
                  />
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ── HOW IT WORKS ───────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 sm:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-5">
                <Zap className="w-4 h-4" /> Simple as 1–2–3
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                How MediCura works
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
              <div
                className="hidden sm:block absolute top-[2.75rem] left-[22%] right-[22%] h-px"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(16,185,129,.25) 30%,rgba(16,185,129,.25) 70%,transparent)",
                }}
              />
              {steps.map((step, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.12}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-500/15 rounded-full blur-xl group-hover:bg-emerald-500/25 transition-all duration-500" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-500/60 group-hover:scale-110 transition-all duration-300">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {step.icon}
                      </span>
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-[14rem]">
                    {step.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES BENTO ─────────────────────────────────────────────────────── */}
        <section id="features" className="py-20 sm:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-5">
                <Award className="w-4 h-4" /> Everything you need
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                Comprehensive healthcare
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  in one platform
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                From appointments to billing — every healthcare touchpoint,
                beautifully unified.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
              <FeatureCard
                feature={features[0]}
                span="sm:col-span-2 md:col-span-4"
                large
              />
              <FeatureCard feature={features[1]} span="sm:col-span-2" />
              <FeatureCard
                feature={features[2]}
                span="sm:col-span-1 md:col-span-2"
              />
              <FeatureCard
                feature={features[3]}
                span="sm:col-span-1 md:col-span-2"
              />
              <FeatureCard
                feature={features[4]}
                span="sm:col-span-2 md:col-span-2"
              />
              <FeatureCard
                feature={features[5]}
                span="sm:col-span-2 md:col-span-2"
              />
              <FeatureCard
                feature={features[6]}
                span="sm:col-span-2 md:col-span-4"
                large
              />
              <FeatureCard
                feature={features[7]}
                span="sm:col-span-1 md:col-span-3"
              />
              <FeatureCard
                feature={features[8]}
                span="sm:col-span-1 md:col-span-3"
              />
            </div>
          </div>
        </section>

        {/* ── PLATFORM ROLES ─────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/50 to-transparent dark:via-slate-900/35" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-12 sm:mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                Built for every role
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  in healthcare
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                Purpose-built dashboards for every member of the healthcare
                ecosystem.
              </p>
            </Reveal>
            {/* scrollable tabs on mobile */}
            <div
              ref={tabsRef}
              className="tabs-scroll overflow-x-auto pb-2 mb-8 sm:mb-10"
            >
              <div className="flex gap-2.5 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
                {platformFeatures.map((p, i) => {
                  const rc = roleConfig[i];
                  const active = activeRole === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveRole(i)}
                      className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border whitespace-nowrap flex-shrink-0 ${
                        active
                          ? `${rc.tab} text-white border-transparent shadow-lg scale-[1.02]`
                          : `bg-white/60 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15`
                      }`}
                    >
                      <span className="mr-1.5">{p.icon}</span>
                      {p.title.replace("For ", "")}
                    </button>
                  );
                })}
              </div>
            </div>
            {platformFeatures.map((p, i) => {
              if (i !== activeRole) return null;
              const rc = roleConfig[i];
              return (
                <div
                  key={i}
                  className={`rounded-2xl border ${rc.border} backdrop-blur-sm p-6 sm:p-8 md:p-10 bg-white/70 dark:bg-transparent`}
                  style={{
                    background: `linear-gradient(135deg, ${["rgba(16,185,129", "rgba(14,165,233", "rgba(139,92,246", "rgba(244,63,94"][i]},.06) 0%,transparent 100%)`,
                    animation: "float-a 0s",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${rc.bg} border ${rc.border} flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0`}
                        >
                          {p.icon}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            {p.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
                            {p.description}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                        MediCura gives{" "}
                        {p.title.replace("For ", "").toLowerCase()}s a powerful,
                        intuitive workspace designed to eliminate friction and
                        let them focus on what matters — delivering excellent
                        care.
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {p.features.map((f, fi) => (
                        <li
                          key={fi}
                          className="flex items-start gap-3 bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.05] rounded-xl px-3.5 sm:px-4 py-3"
                        >
                          <CheckCircle
                            className={`w-4 h-4 mt-0.5 ${rc.check} flex-shrink-0`}
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── PRICING ────────────────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 sm:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-5">
                <Heart className="w-4 h-4" /> Transparent pricing
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                Plans for every
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  healthcare need
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                No hidden fees. No surprises. Cancel any time.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-start">
              {pricingPlans.map((plan, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.1}
                  className={`relative rounded-2xl p-7 sm:p-8 transition-all duration-500 card-glow hover:-translate-y-2 ${
                    plan.popular
                      ? "bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-500/14 dark:to-slate-900/90 border-2 border-emerald-500/40 dark:border-emerald-500/45 shadow-2xl shadow-emerald-500/12"
                      : "bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/14 backdrop-blur-sm shadow-sm dark:shadow-none"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/40">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-7">
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1.5 mb-8">
                    <span className="text-5xl font-black text-slate-900 dark:text-white leading-none">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm mb-1.5">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGetStarted}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25"
                        : "border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:border-slate-400 dark:hover:border-white/20"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEPARTMENTS ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/40 to-transparent dark:via-slate-900/30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                Specialised care
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  across every department
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                Expert professionals across multiple specialties — all on one
                platform.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {departments.map((dept, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.07}
                  className="group relative bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-white/[0.05] hover:border-emerald-500/40 dark:hover:border-emerald-500/25 p-6 sm:p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:hover:bg-slate-800/50 card-glow overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-emerald-500/6 to-transparent transition-opacity duration-500" />
                  <div className="relative">
                    <div className="text-3xl sm:text-4xl mb-4 sm:mb-5">
                      {dept.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 sm:mb-5 leading-relaxed">
                      {dept.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                        <Users className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          {dept.doctors} Doctors
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-full px-2.5 py-1">
                        <Award className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          {dept.specialties.length} Specialties
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {dept.specialties.map((s, si) => (
                        <span
                          key={si}
                          className="text-[10px] sm:text-[11px] bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 rounded-full px-2.5 py-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────────────────────── */}
        <section id="testimonials" className="py-20 sm:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-5">
                <Star className="w-4 h-4 fill-emerald-500 dark:fill-emerald-400" />{" "}
                Loved by thousands
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                Real stories,
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  real results
                </span>
              </h2>
            </Reveal>
            {/* featured */}
            <Reveal className="mb-5 gradient-border-card rounded-2xl p-7 sm:p-10 relative overflow-hidden">
              <div className="absolute top-4 right-6 sm:top-6 sm:right-8 text-7xl sm:text-8xl font-serif text-emerald-500/10 dark:text-emerald-500/8 leading-none select-none">
                "
              </div>
              <div className="flex gap-0.5 mb-4 sm:mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-slate-900 dark:text-white text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-7 max-w-3xl">
                "{testimonials[0].quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {testimonials[0].initials}
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold">
                    {testimonials[0].name}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                    {testimonials[0].role}
                  </p>
                </div>
              </div>
            </Reveal>
            {/* grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {testimonials.slice(1).map((t, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.08}
                  className="relative group bg-white dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/10 p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:shadow-none overflow-hidden"
                >
                  <div className="absolute top-4 right-5 text-5xl font-serif text-slate-200/60 dark:text-white/5 leading-none select-none">
                    "
                  </div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-5">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold text-sm">
                        {t.name}
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100 dark:from-emerald-900/80 dark:via-teal-950/55 dark:to-slate-900" />
                <div className="absolute inset-0 border border-emerald-500/20 dark:border-emerald-500/18 rounded-3xl" />
                <div className="absolute -top-20 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-500/12 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 right-1/4 w-72 sm:w-80 h-72 sm:h-80 bg-teal-500/12 rounded-full blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.04] dark:opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle,rgba(0,0,0,.5) 1px,transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <div className="relative px-6 sm:px-12 lg:px-24 py-16 sm:py-20 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/25 dark:bg-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-7 sm:mb-8">
                    <Sparkles className="w-4 h-4" /> Join 10,000+ patients today
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-5 sm:mb-6 leading-tight max-w-3xl mx-auto">
                    Take control of your healthcare journey
                  </h2>
                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join thousands who've simplified their healthcare with
                    MediCura. Start your journey today — it only takes 60
                    seconds to sign up.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={onGetStarted}
                      className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base font-black transition-all duration-300 shadow-2xl flex items-center gap-3 justify-center"
                    >
                      Get Started Free{" "}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={onBookAppointment}
                      className="group border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:bg-white/60 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/30 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-3 justify-center"
                    >
                      <Phone className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />{" "}
                      Book a Consultation
                    </button>
                  </div>
                  <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm mt-5 sm:mt-6">
                    No credit card required · Cancel anytime · HIPAA compliant
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
        <footer className="relative">
          {/* gradient top line */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent 0%,rgba(16,185,129,.35) 30%,rgba(20,184,166,.35) 50%,rgba(16,185,129,.35) 70%,transparent 100%)",
            }}
          />

          <div className="bg-slate-100 dark:bg-[#020810]">
            {/* newsletter strip */}
            <div className="border-b border-slate-200 dark:border-white/[0.05]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
                  <div className="max-w-sm">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Stay in the loop
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Healthcare insights, product updates, and wellness tips —
                      delivered to your inbox.
                    </p>
                  </div>
                  {subDone ? (
                    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-5 py-3.5">
                      <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                        You're subscribed! Welcome aboard.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSub}
                      className="flex gap-3 w-full lg:w-auto"
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 lg:w-72 bg-white dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500/40 focus:bg-white dark:focus:bg-white/[0.07] transition-all"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shadow-lg shadow-emerald-500/20"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* main grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
                {/* brand col */}
                <div className="col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-25" />
                      <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                        <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                    </div>
                    <span className="text-xl font-bold">
                      Medi
                      <span className="text-emerald-500 dark:text-emerald-400">
                        Cura
                      </span>
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mb-7">
                    The all-in-one healthcare platform connecting patients,
                    doctors, pharmacists, and administrators in one beautifully
                    secure space.
                  </p>
                  {/* social icons */}
                  <div className="flex items-center gap-2.5 mb-6">
                    {[
                      {
                        title: "X (Twitter)",
                        path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.634L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
                      },
                      {
                        title: "LinkedIn",
                        path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                      },
                      {
                        title: "GitHub",
                        path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
                      },
                    ].map((s) => (
                      <a
                        key={s.title}
                        href="#"
                        title={s.title}
                        className="w-9 h-9 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/15 transition-all"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                          fill="currentColor"
                        >
                          <path d={s.path} />
                        </svg>
                      </a>
                    ))}
                    <a
                      href="#"
                      title="Email"
                      className="w-9 h-9 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/15 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                  {/* trust badges */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: <Shield className="w-3 h-3" />, label: "HIPAA" },
                      { icon: <Lock className="w-3 h-3" />, label: "SOC 2" },
                      {
                        icon: <Award className="w-3 h-3" />,
                        label: "ISO 27001",
                      },
                    ].map((b) => (
                      <div
                        key={b.label}
                        className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/15 rounded-full px-2.5 py-1"
                      >
                        <span className="text-emerald-500 dark:text-emerald-400">
                          {b.icon}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          {b.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* link columns */}
                {Object.entries(footerLinks).map(([heading, links]) => (
                  <div key={heading}>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.12em] mb-5">
                      {heading}
                    </h4>
                    <ul className="space-y-3">
                      {links.map((l) => (
                        <li key={l}>
                          <a
                            href="#"
                            className="group flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                          >
                            {l}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* bottom bar */}
            <div className="border-t border-slate-200 dark:border-white/[0.05]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 text-slate-500 dark:text-slate-500 text-xs">
                    <span>© 2024 MediCura, Inc.</span>
                    <a
                      href="#"
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Privacy
                    </a>
                    <a
                      href="#"
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Terms
                    </a>
                    <a
                      href="#"
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Cookies
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-slate-500 dark:text-slate-500 text-xs">
                        All systems operational
                      </span>
                    </div>
                    <button
                      onClick={scrollTop}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/15 transition-all"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
