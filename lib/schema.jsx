import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  date,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Users Table
export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // "patient", "doctor", "pharmacist", "receptionist"
  createdAt: timestamp("createdAt").defaultNow(),
});

// Patient Table
export const Patients = pgTable("patients", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  phone: varchar("phone", { length: 20 }),
  dateOfBirth: date("dateOfBirth"),
  gender: varchar("gender", { length: 20 }),
  address: text("address"),
  occupation: varchar("occupation", { length: 255 }),
  emergencyContactName: varchar("emergencyContactName", { length: 255 }),
  emergencyPhone: varchar("emergencyPhone", { length: 20 }),

  primaryPhysician: varchar("primaryPhysician", { length: 255 }),
  insuranceProvider: varchar("insuranceProvider", { length: 255 }),
  insurancePolicyNumber: varchar("insurancePolicyNumber", { length: 255 }),
  allergies: text("allergies"),
  currentMedications: text("currentMedications"),
  familyMedicalHistory: text("familyMedicalHistory"),
  pastMedicalHistory: text("pastMedicalHistory"),

  identificationType: varchar("identificationType", { length: 100 }),
  identificationNumber: varchar("identificationNumber", { length: 255 }),

  treatmentConsent: boolean("treatmentConsent").default(true),
  disclosureConsent: boolean("disclosureConsent").default(false),
  privacyConsent: boolean("privacyConsent").default(true),

  hasOnboarded: boolean("hasOnboarded").default(false),
});

// Doctor Table
export const Doctors = pgTable("doctors", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  medicalLicenseNumber: varchar("medicalLicenseNumber", { length: 255 }),
  specialty: varchar("specialty", { length: 255 }),
  subSpecialty: varchar("subSpecialty", { length: 255 }),
  yearsOfExperience: integer("yearsOfExperience"),
  currentHospital: varchar("currentHospital", { length: 255 }),
  previousHospitals: text("previousHospitals"),

  medicalSchool: varchar("medicalSchool", { length: 255 }),
  graduationYear: varchar("graduationYear", { length: 4 }),
  residencyProgram: varchar("residencyProgram", { length: 255 }),
  fellowshipProgram: varchar("fellowshipProgram", { length: 255 }),
  boardCertifications: text("boardCertifications"),
  continuingEducation: text("continuingEducation"),

  consultationFee: varchar("consultationFee", { length: 50 }),
  availableHours: varchar("availableHours", { length: 255 }),
  languagesSpoken: text("languagesSpoken"),
  insuranceAccepted: text("insuranceAccepted"),

  practiceConsent: boolean("practiceConsent").default(true),
  dataConsent: boolean("dataConsent").default(true),
  ethicsConsent: boolean("ethicsConsent").default(true),

  hasOnboarded: boolean("hasOnboarded").default(false),
});

// Pharmacist Table
export const Pharmacists = pgTable("pharmacists", {
  userId: uuid("userId")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),

  pharmacyLicenseNumber: varchar("pharmacyLicenseNumber", { length: 255 }),
  deaNumber: varchar("deaNumber", { length: 255 }),
  npiNumber: varchar("npiNumber", { length: 255 }),
  pharmacyType: varchar("pharmacyType", { length: 255 }),
  currentPharmacy: varchar("currentPharmacy", { length: 255 }),
  yearsOfExperience: integer("yearsOfExperience"),
  specializations: text("specializations"),

  pharmacySchool: varchar("pharmacySchool", { length: 255 }),
  graduationYear: varchar("graduationYear", { length: 4 }),
  residencyProgram: varchar("residencyProgram", { length: 255 }),
  certifications: text("certifications"),
  continuingEducation: text("continuingEducation"),

  workSchedule: varchar("workSchedule", { length: 255 }),
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

  department: varchar("department", { length: 255 }),
  previousExperience: text("previousExperience"),
  yearsOfExperience: integer("yearsOfExperience"),
  currentEmployer: varchar("currentEmployer", { length: 255 }),
  reasonForLeaving: text("reasonForLeaving"),

  education: varchar("education", { length: 255 }),
  certifications: text("certifications"),
  softwareSkills: text("softwareSkills"),
  languagesSpoken: text("languagesSpoken"),
  typingSpeed: varchar("typingSpeed", { length: 50 }),

  workSchedule: varchar("workSchedule", { length: 255 }),
  shiftPreference: varchar("shiftPreference", { length: 255 }),
  availableHours: varchar("availableHours", { length: 255 }),
  transportationMethod: varchar("transportationMethod", { length: 255 }),

  backgroundCheck: boolean("backgroundCheck").default(true),
  dataConsent: boolean("dataConsent").default(true),
  workAgreement: boolean("workAgreement").default(true),

  hasOnboarded: boolean("hasOnboarded").default(false),
});
