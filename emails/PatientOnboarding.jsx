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

export default function MediCuraPatientOnboardingCompleteEmail({ fullName }) {
  return (
    <Html>
      <Head />
      <Preview>
        🎉 Onboarding Complete! Your MediCura account is ready to use.
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
            Onboarding Complete, {fullName || "Patient"} 🎉
          </Text>

          {/* Body Text */}
          <Text style={paragraph}>
            Congratulations! You’ve successfully completed your onboarding with{" "}
            <strong>MediCura</strong>. Your healthcare profile is now active,
            and you can start scheduling appointments, tracking prescriptions,
            and securely managing your medical records.
          </Text>

          {/* CTA Button */}
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button
              href="https://medicura.vercel.app/patient/dashboard"
              style={button}
            >
              Explore Your Dashboard
            </Button>
          </Section>

          {/* Next Steps */}
          <Text style={paragraph}>Here are some things you can do next:</Text>
          <ul style={list}>
            <li>📅 Book your first appointment with a doctor.</li>
            <li>💊 View and manage your prescriptions.</li>
            <li>📂 Access your digital health records securely.</li>
          </ul>

          {/* Support Note */}
          <Text style={paragraph}>
            Need help? Our support team is always here for you —{" "}
            <a href="mailto:support@medicura.com" style={link}>
              contact us anytime
            </a>
            .
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
  backgroundColor: "#f0fdf4",
  padding: "0",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "32px",
  maxWidth: "520px",
  minHeight: "90vh", // keeps white box tall
  margin: "20px auto",
  border: "1px solid #d1fae5",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
  marginBottom: "16px",
};

const list = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#065f46",
  margin: "12px 0 20px 20px",
  padding: "0",
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
