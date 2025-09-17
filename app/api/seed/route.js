import { db } from "@/lib/dbConfig";
import { Doctors, Patients } from "@/lib/schema";
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

    const patient = [
      {
        userId: "f4e9e1a8-c823-422a-b8f3-103640a99943",
        name: "Sagnik Dey",
        email: "deydsagnik48@gmail.com",
        phone: "+91-9876543210",
        dateOfBirth: "1985-04-15",
        gender: "Male",
        address: "23 MG Road, Indiranagar, Bengaluru, Karnataka",
        occupation: "Software Engineer",
        emergencyContactName: "Rohit Sharma",
        emergencyPhone: "+91-9123456789",

        primaryPhysician: "Dr. Neha Verma",
        insuranceProvider: "LIC Health Insurance",
        insurancePolicyNumber: "LIC-HI-2025-45879",
        insurancePolicyDocument: null,
        insurancePolicyDocumentId: null,
        allergies: ["Peanuts", "Dust"],
        currentMedications: ["Metformin", "Atorvastatin"],
        familyMedicalHistory: ["Diabetes", "Hypertension"],
        pastMedicalHistory: ["Appendectomy (2010)"],

        identificationType: "Aadhaar Card",
        identificationNumber: "5678-1234-9012",
        identificationDocument: null,
        identificationDocumentId: null,

        treatmentConsent: true,
        disclosureConsent: true,
        privacyConsent: true,
      },
    ];

    // console.log(dummyDoctors);

    try {
      await db.insert(Patients).values(patient);
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json({
      // message: "6 dummy doctors seeded successfully (India-specific)!",
      message: "1 dummy patient seeded successfully!",
    });
  } catch (error) {
    console.error("Error seeding doctors:", error);
    return NextResponse.json(
      { error: "Failed to seed doctors" },
      { status: 500 }
    );
  }
}
