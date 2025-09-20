import { db } from "@/lib/dbConfig";
import {
  Doctors,
  InventoryLogs,
  Medicines,
  Patients,
  Pharmacists,
} from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const dummyDoctors = [
    //   {
    //     userId: "9ec3a0ae-d7e6-4a67-b7d9-5adb29dc0fea",
    //     name: "Dr. Arjun Mehta",
    //     phone: "+91 9876543210",
    //     avatar: "/avatars/dr-arjun.png",
    //     medicalLicenseNumber: "MCI/DEL/12345",
    //     speciality: "Cardiology",
    //     subSpecialty: "Interventional Cardiology",
    //     yearsOfExperience: 15,
    //     previousHospitals:
    //       "AIIMS New Delhi (2008–2015), Fortis Escorts Heart Institute (2015–2023)",

    //     medicalSchool: "AIIMS New Delhi",
    //     graduationYear: "2008",
    //     residencyProgram: "Internal Medicine – AIIMS",
    //     fellowshipProgram: "Cardiology Fellowship – Fortis Escorts",
    //     boardCertifications:
    //       "Medical Council of India (MCI), Indian Society of Cardiology",
    //     continuingEducation:
    //       "Cardio Update 2022 (Mumbai), Asia-Pacific Cardiology Conference 2023",

    //     consultationFee: "1200",
    //     availableDays: ["Monday", "Wednesday", "Friday"],
    //     availableHours: { start: "10:00", end: "14:00" },
    //     languagesSpoken: ["English", "Hindi"],

    //     practiceConsent: true,
    //     dataConsent: true,
    //     ethicsConsent: true,
    //     hasOnboarded: true,
    //   },
    //   {
    //     userId: "2fc68bec-c735-49f7-bb33-7ca7c740bd8c",
    //     name: "Dr. Priya Sharma",
    //     phone: "+91 9988776655",
    //     avatar:
    //       "https://ik.imagekit.io/o3jhcpnqcj/Doctor-Profile-Photo/doctor-avatar.jpg?updatedAt=1758129601426",
    //     medicalLicenseNumber: "MCI/MUM/54321",
    //     speciality: "Pediatrics",
    //     subSpecialty: "Neonatology",
    //     yearsOfExperience: 10,
    //     previousHospitals:
    //       "KEM Hospital Mumbai (2012–2017), Apollo Hospitals (2017–Present)",

    //     medicalSchool: "Grant Medical College, Mumbai",
    //     graduationYear: "2012",
    //     residencyProgram: "Pediatrics – KEM Hospital",
    //     fellowshipProgram: "Neonatology – Apollo Hospitals",
    //     boardCertifications: "Indian Academy of Pediatrics (IAP)",
    //     continuingEducation:
    //       "Neonatal Care Conference 2022, IAP Conference 2023",

    //     consultationFee: "900",
    //     availableDays: ["Tuesday", "Thursday", "Saturday"],
    //     availableHours: { start: "11:00", end: "17:00" },
    //     languagesSpoken: ["English", "Hindi", "Marathi"],

    //     practiceConsent: true,
    //     dataConsent: true,
    //     ethicsConsent: true,
    //     hasOnboarded: true,
    //   },
    //   {
    //     userId: "6731f6b7-8dc2-4d70-a770-d3a14998690c",
    //     name: "Dr. Rohan Gupta",
    //     phone: "+91 9123456789",
    //     avatar:
    //       "https://ik.imagekit.io/o3jhcpnqcj/Doctor-Profile-Photo/doctor-avatar.jpg?updatedAt=1758129601426",
    //     medicalLicenseNumber: "MCI/BLR/56789",
    //     speciality: "Orthopedics",
    //     subSpecialty: "Joint Replacement",
    //     yearsOfExperience: 12,
    //     previousHospitals:
    //       "Manipal Hospital Bangalore (2010–2016), Apollo Hospitals Bangalore (2016–Present)",

    //     medicalSchool: "Bangalore Medical College",
    //     graduationYear: "2010",
    //     residencyProgram: "Orthopedics – Manipal Hospital",
    //     fellowshipProgram: "Joint Replacement – Apollo Hospitals",
    //     boardCertifications: "Indian Orthopaedic Association",
    //     continuingEducation:
    //       "Asia Pacific Orthopedic Association Conference 2021, IOA Annual Meet 2023",

    //     consultationFee: "1000",
    //     availableDays: ["Monday", "Tuesday", "Thursday"],
    //     availableHours: { start: "09:00", end: "13:00" },
    //     languagesSpoken: ["English", "Hindi", "Kannada"],

    //     practiceConsent: true,
    //     dataConsent: true,
    //     ethicsConsent: true,
    //     hasOnboarded: true,
    //   },
    //   {
    //     userId: "1727abf8-ef7c-4121-a20b-c54bfc81b23a",
    //     name: "Dr. Neha Verma",
    //     phone: "+91 9765432109",
    //     avatar:
    //       "https://ik.imagekit.io/o3jhcpnqcj/Doctor-Profile-Photo/doctor-avatar.jpg?updatedAt=1758129601426",
    //     medicalLicenseNumber: "MCI/DEL/67890",
    //     speciality: "Dermatology",
    //     subSpecialty: "Cosmetic Dermatology",
    //     yearsOfExperience: 8,
    //     previousHospitals:
    //       "Safdarjung Hospital Delhi (2014–2018), Kaya Skin Clinic (2018–Present)",

    //     medicalSchool: "Maulana Azad Medical College, Delhi",
    //     graduationYear: "2014",
    //     residencyProgram: "Dermatology – Safdarjung Hospital",
    //     fellowshipProgram: "Cosmetic Dermatology – Kaya Clinic",
    //     boardCertifications: "IADVL (Indian Association of Dermatologists)",
    //     continuingEducation: "Dermacon India 2022, Aesthetics Asia 2023",

    //     consultationFee: "800",
    //     availableDays: ["Wednesday", "Friday", "Sunday"],
    //     availableHours: { start: "12:00", end: "18:00" },
    //     languagesSpoken: ["English", "Hindi"],

    //     practiceConsent: true,
    //     dataConsent: true,
    //     ethicsConsent: true,
    //     hasOnboarded: true,
    //   },
    //   {
    //     userId: "fca18774-c07e-41b9-853f-6dae5c2d0f4e",
    //     name: "Dr. Vivek Iyer",
    //     phone: "+91 9345678901",
    //     avatar:
    //       "https://ik.imagekit.io/o3jhcpnqcj/Doctor-Profile-Photo/doctor-avatar.jpg?updatedAt=1758129601426",
    //     medicalLicenseNumber: "MCI/CHN/11223",
    //     speciality: "Neurology",
    //     subSpecialty: "Epilepsy & Stroke",
    //     yearsOfExperience: 14,
    //     previousHospitals:
    //       "Madras Medical College (2009–2015), Apollo Chennai (2015–Present)",

    //     medicalSchool: "Madras Medical College",
    //     graduationYear: "2009",
    //     residencyProgram: "Neurology – Madras Medical College",
    //     fellowshipProgram: "Epilepsy – Apollo Hospitals",
    //     boardCertifications: "Indian Academy of Neurology",
    //     continuingEducation: "NeuroCon 2021, World Stroke Congress 2023",

    //     consultationFee: "1500",
    //     availableDays: ["Monday", "Thursday", "Saturday"],
    //     availableHours: { start: "14:00", end: "18:00" },
    //     languagesSpoken: ["English", "Tamil", "Hindi"],

    //     practiceConsent: true,
    //     dataConsent: true,
    //     ethicsConsent: true,
    //     hasOnboarded: true,
    //   },
    //   {
    //     userId: "64995e81-5297-4248-829b-0b081001b54b",
    //     name: "Dr. Ananya Mukherjee",
    //     phone: "+91 9834567890",
    //     avatar:
    //       "https://ik.imagekit.io/o3jhcpnqcj/Doctor-Profile-Photo/doctor-avatar.jpg?updatedAt=1758129601426",
    //     medicalLicenseNumber: "MCI/KOL/33445",
    //     speciality: "Oncology",
    //     subSpecialty: "Radiation Oncology",
    //     yearsOfExperience: 11,
    //     previousHospitals:
    //       "Tata Medical Center Kolkata (2012–2017), Apollo Gleneagles (2017–Present)",

    //     medicalSchool: "Calcutta National Medical College",
    //     graduationYear: "2012",
    //     residencyProgram: "Oncology – Tata Medical Center",
    //     fellowshipProgram: "Radiation Oncology – Apollo Gleneagles",
    //     boardCertifications: "Association of Radiation Oncologists of India",
    //     continuingEducation: "Indian Cancer Congress 2022, ASTRO Asia 2023",

    //     consultationFee: "1300",
    //     availableDays: ["Tuesday", "Friday", "Sunday"],
    //     availableHours: { start: "10:00", end: "16:00" },
    //     languagesSpoken: ["English", "Hindi", "Bengali"],

    //     practiceConsent: true,
    //     dataConsent: true,
    //     ethicsConsent: true,
    //     hasOnboarded: true,
    //   },
    // ];

    // const patient = [
    //   {
    //     userId: "f4e9e1a8-c823-422a-b8f3-103640a99943",
    //     name: "Sagnik Dey",
    //     email: "deydsagnik48@gmail.com",
    //     phone: "+91-9876543210",
    //     dateOfBirth: "1985-04-15",
    //     gender: "Male",
    //     address: "23 MG Road, Indiranagar, Bengaluru, Karnataka",
    //     occupation: "Software Engineer",
    //     emergencyContactName: "Rohit Sharma",
    //     emergencyPhone: "+91-9123456789",

    //     primaryPhysician: "Dr. Neha Verma",
    //     insuranceProvider: "LIC Health Insurance",
    //     insurancePolicyNumber: "LIC-HI-2025-45879",
    //     insurancePolicyDocument: null,
    //     insurancePolicyDocumentId: null,
    //     allergies: ["Peanuts", "Dust"],
    //     currentMedications: ["Metformin", "Atorvastatin"],
    //     familyMedicalHistory: ["Diabetes", "Hypertension"],
    //     pastMedicalHistory: ["Appendectomy (2010)"],

    //     identificationType: "Aadhaar Card",
    //     identificationNumber: "5678-1234-9012",
    //     identificationDocument: null,
    //     identificationDocumentId: null,

    //     treatmentConsent: true,
    //     disclosureConsent: true,
    //     privacyConsent: true,
    //   },
    // ];

    // const pharmacist = [
    //   {
    //     userId: "a0442548-e117-4244-b3c0-f6ed691d3cc0",

    //     // Profile Info
    //     name: "Nehal Wadhera",
    //     phone: "+91-9876543210",
    //     avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    //     dateOfBirth: new Date("1985-04-12"),
    //     gender: "Female",
    //     address: "C-124, South Extension II, New Delhi, India",
    //     emergencyContactName: "Rajesh Wadhera",
    //     emergencyPhone: "+91-9812345678",

    //     // Professional Info
    //     pharmacyLicenseNumber: "DL-23456/2025",
    //     pharmacyType: "Retail",
    //     currentPharmacy: "Apollo Pharmacy, South Extension II, New Delhi",
    //     yearsOfExperience: 12,
    //     specializations: "Chronic Care, Geriatrics, Pediatrics",

    //     // Education
    //     pharmacySchool:
    //       "Delhi Institute of Pharmaceutical Sciences and Research (DIPSAR)",
    //     graduationYear: "2008",
    //     residencyProgram: "Hospital Pharmacy Residency - AIIMS New Delhi",
    //     certifications: "Drug Safety Certification, Clinical Pharmacology",
    //     continuingEducation:
    //       "Annual CME workshops in Clinical Pharmacy, Diabetes Care Training",

    //     // Practice
    //     workSchedule: "Mon-Sat, 9:00 AM - 7:00 PM",
    //     languagesSpoken: "English, Hindi",
    //     clinicalServices:
    //       "Medication Therapy Management, Immunization Counseling, Chronic Disease Support",
    //     insuranceExperience:
    //       "Handled Mediclaim and cashless pharmacy insurance claims with Apollo Pharmacy",

    //     // Consent
    //     practiceConsent: true,
    //     dataConsent: true,
    //     regulatoryConsent: true,

    //     // Onboarding
    //     hasOnboarded: true,
    //   },
    // ];

    const pharmacistId = "a0442548-e117-4244-b3c0-f6ed691d3cc0";

    const medicines = [
      {
        id: "065ba3c3-4b91-4bb4-9cd4-73075482cad8",
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        manufacturer: "Cipla",
        batchNumber: "PARA001",
        expiryDate: new Date("2026-06-30"),
        quantity: 200,
        minStockLevel: 50,
        unitPrice: 1.5,
        location: "A-1-01",
      },
      {
        id: "24523ec6-d27e-41a3-a89c-cef9cc479775",
        name: "Amoxicillin 500mg",
        category: "Antibiotic",
        manufacturer: "Sun Pharma",
        batchNumber: "AMOX002",
        expiryDate: new Date("2025-12-31"),
        quantity: 100,
        minStockLevel: 30,
        unitPrice: 2.0,
        location: "B-2-05",
      },
      {
        id: "2d3ac5d4-3824-4750-9613-1430d7600b32",
        name: "Metformin 500mg",
        category: "Diabetes",
        manufacturer: "Dr. Reddy’s",
        batchNumber: "MET003",
        expiryDate: new Date("2027-03-15"),
        quantity: 150,
        minStockLevel: 40,
        unitPrice: 1.25,
        location: "C-3-02",
      },
    ];

    // Insert medicines
    await db.insert(Medicines).values(medicines);

    // Insert logs for initial stock
    const logs = medicines.map((med) => ({
      medicineId: med.id,
      pharmacistId,
      action: "add",
      quantityChange: med.quantity,
      prevQuantity: 0,
      newQuantity: med.quantity,
      notes: "Initial stock added during pharmacy setup",
      unitPrice: med.unitPrice,
    }));

    // console.log(logs);

    await db.insert(InventoryLogs).values(logs);

    return NextResponse.json({
      // message: "6 dummy doctors seeded successfully (India-specific)!",
      message: "Medicine & Inventory data seeded successfully!",
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
