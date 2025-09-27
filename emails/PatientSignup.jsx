import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function PatientSignup({ fullName }) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to MediCura 🎉 Your healthcare journey starts here.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "20px" }}>
            <Img
              src="/logo.png"
              alt="MediCura Logo"
              width="100"
              height="100"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Heading */}
          <Text style={heading}>
            Welcome to MediCura, {fullName || "Patient"}!
          </Text>

          {/* Body Text */}
          <Text style={paragraph}>
            We’re excited to have you join <strong>MediCura</strong>, your
            trusted healthcare partner. Your account has been successfully
            created, and you can now access your personal dashboard to manage
            appointments, prescriptions, and medical records anytime.
          </Text>

          {/* CTA Button */}
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button href="https://medicura.vercel.app/sign-in" style={button}>
              Access Your Dashboard
            </Button>
          </Section>

          {/* Security Notice */}
          <Text style={paragraph}>
            Didn’t sign up for MediCura? Please ignore this email or{" "}
            <a href="mailto:support@medicura.com" style={link}>
              contact our support team
            </a>{" "}
            immediately.
          </Text>

          {/* Footer */}
          <Text style={footer}>
            © {new Date().getFullYear()} MediCura. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f0fdf4", // light green background
  padding: "0", // remove extra padding
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "32px",
  maxWidth: "520px",
  minHeight: "90vh", // make white box cover most of the height
  margin: "20px auto", // balanced spacing top/bottom
  border: "1px solid #d1fae5",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // subtle lift
};

const heading = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "16px",
  color: "#166534",
  textAlign: "center",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#065f46",
};

const button = {
  backgroundColor: "#059669",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
};

const link = {
  color: "#059669",
  textDecoration: "underline",
};

const footer = {
  fontSize: "12px",
  color: "#047857",
  marginTop: "24px",
  textAlign: "center",
};
