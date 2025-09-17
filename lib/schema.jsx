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
  allergies: text("allergies"),
  currentMedications: text("currentMedications"),
  familyMedicalHistory: text("familyMedicalHistory"),
  pastMedicalHistory: text("pastMedicalHistory"),

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
  availableDays: jsonb("availableDays"),
  availableHours: varchar("availableHours"),
  languagesSpoken: jsonb("languagesSpoken"),

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

  date: date("date").notNull(),
  time: varchar("time").notNull(), // e.g. "10:30 AM"
  reason: text("reason"),
  notes: text("notes"),

  status: varchar("status").default("upcoming"), // upcoming, completed, cancelled

  type: varchar("type").default("Consultation"), // Consultation, Follow-up, etc.

  bookingDate: timestamp("bookingDate").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Pharmacist Table
export const Pharmacists = pgTable("pharmacists", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  pharmacyLicenseNumber: varchar("pharmacyLicenseNumber"),
  deaNumber: varchar("deaNumber"),
  npiNumber: varchar("npiNumber"),
  pharmacyType: varchar("pharmacyType"),
  currentPharmacy: varchar("currentPharmacy"),
  yearsOfExperience: integer("yearsOfExperience"),
  specializations: text("specializations"),

  pharmacySchool: varchar("pharmacySchool"),
  graduationYear: varchar("graduationYear", { length: 4 }),
  residencyProgram: varchar("residencyProgram"),
  certifications: text("certifications"),
  continuingEducation: text("continuingEducation"),

  workSchedule: varchar("workSchedule"),
  languagesSpoken: text("languagesSpoken"),
  clinicalServices: text("clinicalServices"),
  insuranceExperience: text("insuranceExperience"),

  practiceConsent: boolean("practiceConsent").default(true),
  dataConsent: boolean("dataConsent").default(true),
  regulatoryConsent: boolean("regulatoryConsent").default(true),

  hasOnboarded: boolean("hasOnboarded").default(false),
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
