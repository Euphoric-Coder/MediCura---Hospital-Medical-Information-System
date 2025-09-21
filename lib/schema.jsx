import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  date,
  integer,
  boolean,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

// Users Table
export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("fullName").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  role: varchar("role", { length: 50 }).notNull(), // "patient", "doctor", "pharmacist", "receptionist"
  createdAt: timestamp("createdAt").defaultNow(),
});

// Patient Table
export const Patients = pgTable("patients", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  // Profile
  name: varchar("name"),
  avatar: varchar("avatar"),
  email: varchar("email"),
  phone: varchar("phone"),
  dateOfBirth: date("dateOfBirth"),
  gender: varchar("gender"),
  address: text("address"),
  occupation: varchar("occupation"),
  emergencyContactName: varchar("emergencyContactName"),
  emergencyPhone: varchar("emergencyPhone"),

  primaryPhysician: varchar("primaryPhysician"),
  insuranceProvider: varchar("insuranceProvider"),
  insurancePolicyNumber: varchar("insurancePolicyNumber"),
  insurancePolicyDocument: varchar("insurancePolicyDocument"),
  insurancePolicyDocumentId: varchar("insurancePolicyDocumentId"),
  allergies: jsonb("allergies").default([]),
  currentMedications: jsonb("currentMedications").default([]),
  familyMedicalHistory: jsonb("familyMedicalHistory").default([]),
  pastMedicalHistory: jsonb("pastMedicalHistory").default([]),

  identificationType: varchar("identificationType"),
  identificationNumber: varchar("identificationNumber"),
  identificationDocument: varchar("identificationDocument"),
  identificationDocumentId: varchar("identificationDocumentId"),

  treatmentConsent: boolean("treatmentConsent").default(false),
  disclosureConsent: boolean("disclosureConsent").default(false),
  privacyConsent: boolean("privacyConsent").default(false),

  hasOnboarded: boolean("hasOnboarded").default(false),
});

// Doctor Table
export const Doctors = pgTable("doctors", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  // Profile
  name: varchar("name"),
  phone: varchar("phone"),
  avatar: varchar("avatar"),
  dateOfBirth: date("dateOfBirth"),
  gender: varchar("gender"),
  address: varchar("address"),
  emergencyContactName: varchar("emergencyContactName"),
  emergencyPhone: varchar("emergencyPhone"),
  medicalLicenseNumber: varchar("medicalLicenseNumber"),
  speciality: varchar("speciality"),
  subSpecialty: varchar("subSpecialty").default("NA"),
  yearsOfExperience: integer("yearsOfExperience"),
  previousHospitals: varchar("previousHospitals"),

  // Education
  medicalSchool: varchar("medicalSchool"),
  graduationYear: varchar("graduationYear"),
  residencyProgram: varchar("residencyProgram"),
  fellowshipProgram: varchar("fellowshipProgram"),
  boardCertifications: varchar("boardCertifications"),
  continuingEducation: varchar("continuingEducation"),

  // Services
  consultationFee: varchar("consultationFee"),
  rating: numeric("rating").default(0),
  availableDays: jsonb("availableDays").default([]),
  availableHours: jsonb("availableHours").default([]),
  languagesSpoken: jsonb("languagesSpoken").default([]),

  // Documents
  cv: varchar("cv"),
  cvId: varchar("cvId"),
  medicalLicenseDocument: varchar("medicalLicenseDocument"),
  medicalLicenseDocumentId: varchar("medicalLicenseDocumentId"),
  medicalCertificateDocument: varchar("medicalCertificateDocument"),
  medicalCertificateDocumentId: varchar("medicalCertificateDocumentId"),

  // Consents
  practiceConsent: boolean("practiceConsent").default(false),
  dataConsent: boolean("dataConsent").default(false),
  ethicsConsent: boolean("ethicsConsent").default(false),

  hasOnboarded: boolean("hasOnboarded").default(false),
});

// Appointments Table
export const Appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),

  patientId: uuid("patientId")
    .notNull()
    .references(() => Patients.userId, { onDelete: "cascade" }),

  doctorId: uuid("doctorId")
    .notNull()
    .references(() => Doctors.userId, { onDelete: "cascade" }),

  // Data to be stored
  patient: jsonb("patient"),
  doctor: jsonb("doctor"),

  date: date("date").notNull(),
  time: varchar("time").notNull(), // e.g. "10:30 AM"
  reason: text("reason"),
  notes: text("notes"),

  status: varchar("status").default("upcoming"), // upcoming, completed, cancelled

  workflow: varchar("workflow").default("scheduled"), // arrived, checked-in, in-consultation, completed

  type: varchar("type").default("Consultation"), // Consultation, Follow-up, etc.

  isUrgent: boolean("isUrgent").default(false),

  bookingDate: timestamp("bookingDate").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const Consultations = pgTable("consultations", {
  id: uuid("id").defaultRandom().primaryKey(),

  doctorId: uuid("doctorId")
    .notNull()
    .references(() => Doctors.userId, { onDelete: "cascade" }),

  patientId: uuid("patientId")
    .notNull()
    .references(() => Patients.userId, { onDelete: "cascade" }),

  appointmentId: uuid("appointmentId").references(() => Appointments.id, {
    onDelete: "set null",
  }),

  // Clinical notes
  chiefComplaint: jsonb("chiefComplaint").default([]),
  historyOfPresentIllness: jsonb("historyOfPresentIllness").default([]),
  physicalExamination: jsonb("physicalExamination").default([]),
  assessment: jsonb("assessment").default([]),
  plan: jsonb("plan").default([]),

  // Admission info
  admissionRequired: boolean("admissionRequired").default(false),
  admissionType: varchar("admissionType"),
  admissionReason: varchar("admissionReason"),

  // Follow-up
  followUpInstructions: jsonb("followUpInstructions").default([]),
  nextAppointment: date("nextAppointment"),

  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const Prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  consultationId: uuid("consultationId")
    .notNull()
    .references(() => Consultations.id, { onDelete: "cascade" }),

  medication: varchar("medication").notNull(),
  dosage: varchar("dosage"),
  frequency: varchar("frequency"),
  duration: varchar("duration"),
  instructions: varchar("instructions"),

  startDate: varchar("startDate"),
  endDate: varchar("endDate"),

  status: varchar("status").default("recommended"), // ordered, completed, pending, cancelled, request-calcellation, discontinued
  medicineValidity: varchar("medicineValidity"),
  sideEffects: jsonb("sideEffects").default([]),
  interaction: jsonb("interaction").default([]),
  cost: numeric("cost"),

  billGenerated: boolean("billGenerated").default(false),

  dispensedDuration: varchar("dispensedDuration"), // e.g., "30 days", "60 days"
  nextRefillDate: varchar("nextRefillDate"),
  refillsRemaining: integer("refillsRemaining").default(0),
  lastDispensedDate: varchar("lastDispensedDate"),
  pharmacistNotes: varchar("pharmacistNotes"),

  createdAt: timestamp("createdAt").defaultNow(),
});

export const LabTests = pgTable("lab_tests", {
  id: uuid("id").defaultRandom().primaryKey(),

  consultationId: uuid("consultationId")
    .notNull()
    .references(() => Consultations.id, { onDelete: "cascade" }),

  testName: varchar("testName").notNull(),
  category: varchar("category"),

  // optional results/remarks
  result: jsonb("result").default([]),
  status: varchar("status").default("recommended"), // recommended, ordered, completed, pending

  createdAt: timestamp("createdAt").defaultNow(),
});

// Pharmacist Table
export const Pharmacists = pgTable("pharmacists", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  // Profile
  name: varchar("name"),
  phone: varchar("phone"),
  avatar: varchar("avatar"),
  dateOfBirth: date("dateOfBirth"),
  gender: varchar("gender"),
  address: varchar("address"),
  emergencyContactName: varchar("emergencyContactName"),
  emergencyPhone: varchar("emergencyPhone"),

  // Professional
  pharmacyLicenseNumber: varchar("pharmacyLicenseNumber"),
  pharmacyType: varchar("pharmacyType"),
  currentPharmacy: varchar("currentPharmacy"),
  yearsOfExperience: integer("yearsOfExperience"),
  specializations: text("specializations"),

  // Education
  pharmacySchool: varchar("pharmacySchool"),
  graduationYear: varchar("graduationYear", { length: 4 }),
  residencyProgram: varchar("residencyProgram"),
  certifications: text("certifications"),
  continuingEducation: text("continuingEducation"),

  // Practice Details
  workSchedule: varchar("workSchedule"),
  languagesSpoken: text("languagesSpoken"),
  clinicalServices: text("clinicalServices"),
  insuranceExperience: text("insuranceExperience"),

  // Consent
  practiceConsent: boolean("practiceConsent").default(true),
  dataConsent: boolean("dataConsent").default(true),
  regulatoryConsent: boolean("regulatoryConsent").default(true),

  hasOnboarded: boolean("hasOnboarded").default(false),
});

// Medicine Table
export const Medicines = pgTable("medicines", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  category: varchar("category"),
  manufacturer: varchar("manufacturer"),
  batchNumber: varchar("batchNumber"),
  expiryDate: varchar("expiryDate"),
  quantity: varchar("quantity").default(0),
  minStockLevel: varchar("minStockLevel").default(0),
  unitPrice: varchar("unitPrice"),
  location: varchar("location"),
  status: varchar("status").default("in-stock"), // in-stock, out-of-stock, expired, low-stock
  createdAt: timestamp("createdAt").defaultNow(),
});

// Inventory Logs
export const InventoryLogs = pgTable("inventory_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  medicineId: uuid("medicineId").references(() => Medicines.id, {
    onDelete: "set null",
  }),

  pharmacistId: uuid("pharmacistId").references(() => Pharmacists.userId, {
    onDelete: "set null",
  }),

  // Type of transaction
  action: varchar("action").notNull(),
  // "added", "restocked", "dispensed", "adjusted"

  // Quantity change (+ve for increase, -ve for decrease)
  quantityChange: varchar("quantityChange").notNull(),

  // Previous quantity before transaction
  prevQuantity: varchar("prevQuantity").notNull(),

  // Running quantity after transaction
  newQuantity: varchar("newQuantity").notNull(),

  // Optional notes (batch details, correction reason, etc.)
  notes: varchar("notes"),

  // Unit price snapshot at the time
  unitPrice: varchar("unitPrice"),

  createdAt: timestamp("createdAt").defaultNow(),
});

// Receptionist Table
export const Receptionists = pgTable("receptionists", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  department: varchar("department"),
  previousExperience: text("previousExperience"),
  yearsOfExperience: integer("yearsOfExperience"),
  currentEmployer: varchar("currentEmployer"),
  reasonForLeaving: text("reasonForLeaving"),

  education: varchar("education"),
  certifications: text("certifications"),
  softwareSkills: text("softwareSkills"),
  languagesSpoken: text("languagesSpoken"),
  typingSpeed: varchar("typingSpeed", { length: 50 }),

  workSchedule: varchar("workSchedule"),
  shiftPreference: varchar("shiftPreference"),
  availableHours: varchar("availableHours"),
  transportationMethod: varchar("transportationMethod"),

  backgroundCheck: boolean("backgroundCheck").default(true),
  dataConsent: boolean("dataConsent").default(true),
  workAgreement: boolean("workAgreement").default(true),

  hasOnboarded: boolean("hasOnboarded").default(false),
});
