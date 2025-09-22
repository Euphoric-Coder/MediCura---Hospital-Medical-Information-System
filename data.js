export const features = [
  {
    title: "Easy Appointment Booking",
    description: "Schedule appointments with your preferred healthcare providers in just a few clicks. No more waiting on hold.",
    icon: "📅"
  },
  {
    title: "Expert Healthcare Team",
    description: "Connect with certified healthcare professionals who are dedicated to providing you with the best care possible.",
    icon: "👨‍⚕️"
  },
  {
    title: "Secure & Private",
    description: "Your health data is protected with industry-leading security measures. Complete privacy and confidentiality guaranteed.",
    icon: "🔒"
  },
  {
    title: "Digital Prescriptions",
    description: "Receive and manage your prescriptions digitally. Track refills, view instructions, and download prescription records.",
    icon: "💊"
  },
  {
    title: "Lab Results Access",
    description: "View your lab results instantly when they're ready. Download reports and track your health metrics over time.",
    icon: "🧪"
  },
  {
    title: "Medical Records",
    description: "Keep all your medical history and documents in one secure place. Access them anytime, anywhere.",
    icon: "📋"
  },
  {
    title: "Billing Management",
    description: "View and manage your medical bills, insurance claims, and payment history all in one convenient location.",
    icon: "💳"
  },
  {
    title: "Multi-Role Support",
    description: "Designed for patients, doctors, pharmacists, receptionists, and administrators with role-specific dashboards.",
    icon: "👥"
  },
  {
    title: "Real-time Updates",
    description: "Get instant notifications for appointment confirmations, prescription updates, and important health information.",
    icon: "🔔"
  }
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    initials: "SJ",
    quote: "CarePulse has made managing my healthcare so much easier. I can book appointments, view my prescriptions, and access my lab results all in one place."
  },
  {
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    initials: "MC",
    quote: "The doctor dashboard is incredibly intuitive. I can manage my patients, write prescriptions, and track consultations efficiently."
  },
  {
    name: "Emily Rodriguez",
    role: "Pharmacist",
    initials: "ER",
    quote: "The prescription management system has streamlined our pharmacy operations. Drug interaction checking and inventory management are seamless."
  },
  {
    name: "James Wilson",
    role: "Patient",
    initials: "JW",
    quote: "I love how I can see all my consultation history and prescriptions organized by doctor visits. It's like having my complete medical record at my fingertips."
  },
  {
    name: "Dr. Lisa Park",
    role: "General Medicine",
    initials: "LP",
    quote: "The consultation notes feature with voice-to-text has saved me so much time. I can focus more on patient care rather than documentation."
  },
  {
    name: "Maria Garcia",
    role: "Receptionist",
    initials: "MG",
    quote: "Patient registration and appointment scheduling has never been easier. The insurance verification system is a game-changer."
  }
];

export const pricingPlans = [
  {
    name: "Basic Care",
    price: "$29",
    period: "per month",
    description: "Perfect for individuals seeking basic healthcare management",
    features: [
      "Up to 2 consultations per month",
      "Basic appointment booking",
      "Prescription management",
      "Medical records access",
      "Email support"
    ],
    popular: false,
    buttonText: "Get Started",
    buttonVariant: "outline"
  },
  {
    name: "Family Care",
    price: "$79",
    period: "per month",
    description: "Ideal for families needing comprehensive healthcare coverage",
    features: [
      "Unlimited consultations",
      "Priority appointment booking",
      "Advanced prescription tracking",
      "Lab results integration",
      "Family member management",
      "24/7 phone support",
      "Telemedicine access"
    ],
    popular: true,
    buttonText: "Most Popular",
    buttonVariant: "default"
  },
  {
    name: "Premium Care",
    price: "$149",
    period: "per month",
    description: "Complete healthcare solution with premium features",
    features: [
      "Everything in Family Care",
      "Dedicated care coordinator",
      "Home visit consultations",
      "Advanced health analytics",
      "Specialist referrals",
      "Emergency consultation access",
      "Personalized health insights",
      "Priority lab processing"
    ],
    popular: false,
    buttonText: "Go Premium",
    buttonVariant: "outline"
  }
];

export const healthcareBenefits = [
  "Access to <strong>certified healthcare professionals</strong> with verified credentials and specializations",
  "Secure <strong>HIPAA-compliant platform</strong> ensuring your medical data privacy and security",
  "Comprehensive <strong>medical record management</strong> with consultation history and prescription tracking",
  "Real-time <strong>prescription management</strong> with refill tracking and pharmacy integration",
  "Instant access to <strong>lab results and diagnostic reports</strong> as soon as they're available",
  "Seamless <strong>insurance verification</strong> and billing management for hassle-free payments",
  "Multi-device access with <strong>responsive design</strong> for desktop, tablet, and mobile devices",
  "24/7 platform availability with <strong>emergency consultation</strong> options when needed"
];

export const departments = [
  {
    name: "General Medicine",
    description: "Comprehensive primary care for adults and families",
    icon: "🩺",
    doctors: 12,
    specialties: ["Family Medicine", "Internal Medicine", "Preventive Care"]
  },
  {
    name: "Cardiology",
    description: "Heart and cardiovascular system specialists",
    icon: "❤️",
    doctors: 8,
    specialties: ["Interventional Cardiology", "Electrophysiology", "Heart Surgery"]
  },
  {
    name: "Pediatrics",
    description: "Specialized care for infants, children, and adolescents",
    icon: "👶",
    doctors: 10,
    specialties: ["Neonatology", "Pediatric Surgery", "Child Development"]
  },
  {
    name: "Emergency Medicine",
    description: "24/7 emergency care and critical treatment",
    icon: "🚨",
    doctors: 15,
    specialties: ["Trauma Care", "Critical Care", "Emergency Surgery"]
  },
  {
    name: "Pharmacy Services",
    description: "Comprehensive medication management and consultation",
    icon: "💊",
    doctors: 6,
    specialties: ["Clinical Pharmacy", "Drug Interaction Checking", "Medication Therapy"]
  },
  {
    name: "Laboratory Services",
    description: "Advanced diagnostic testing and analysis",
    icon: "🧪",
    doctors: 5,
    specialties: ["Clinical Chemistry", "Hematology", "Microbiology"]
  }
];

export const stats = [
  {
    number: "10,000+",
    label: "Patients Served",
    description: "Trusted by thousands of patients"
  },
  {
    number: "150+",
    label: "Healthcare Professionals",
    description: "Certified doctors and specialists"
  },
  {
    number: "50,000+",
    label: "Consultations Completed",
    description: "Successful medical consultations"
  },
  {
    number: "99.9%",
    label: "Platform Uptime",
    description: "Reliable healthcare access"
  }
];

export const platformFeatures = [
  {
    title: "For Patients",
    description: "Complete healthcare management at your fingertips",
    features: [
      "Book and manage appointments",
      "View consultation history",
      "Track prescriptions and refills",
      "Access lab results instantly",
      "Manage medical records",
      "Handle billing and payments",
      "Emergency contact access"
    ],
    color: "from-green-500/10 to-green-600/5",
    icon: "👤"
  },
  {
    title: "For Doctors",
    description: "Streamlined practice management and patient care",
    features: [
      "Manage patient consultations",
      "Write digital prescriptions",
      "Order lab tests",
      "Track patient history",
      "Schedule management",
      "Generate medical reports",
      "Hospital admission management"
    ],
    color: "from-blue-500/10 to-blue-600/5",
    icon: "👨‍⚕️"
  },
  {
    title: "For Pharmacists",
    description: "Efficient medication management and patient safety",
    features: [
      "Verify prescriptions",
      "Manage inventory",
      "Check drug interactions",
      "Generate pharmacy bills",
      "Track patient medication history",
      "Monitor stock levels",
      "Generate pharmacy reports"
    ],
    color: "from-purple-500/10 to-purple-600/5",
    icon: "💊"
  },
  {
    title: "For Receptionists",
    description: "Streamlined front desk operations and patient service",
    features: [
      "Register new patients",
      "Schedule appointments",
      "Manage patient check-ins",
      "Verify insurance coverage",
      "Process payments",
      "Handle patient inquiries",
      "Generate reception reports"
    ],
    color: "from-pink-500/10 to-pink-600/5",
    icon: "📞"
  }
];