import React from "react";
import LegalPage from "@/components/petrx/LegalPage";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      lastUpdated="July 8, 2026"
      intro="PetRx Pharmacy respects your privacy and is committed to protecting the personal and health-related information you share with us. This policy explains what we collect, how we use it, and the choices you have."
      sections={[
        {
          heading: "1. Information We Collect",
          body: "We collect information necessary to dispense medications, process orders, and provide pharmacy services.",
          list: [
            "Account information: name, email address, password, and contact details.",
            "Pet health information: pet name, species, breed, weight, medical conditions, allergies, and current medications.",
            "Prescription information: prescribing veterinarian details, prescription documents, and verification records.",
            "Order and payment information: shipping address, order history, and billing details (payment is processed through secure third-party providers).",
            "Communications: messages you send to our pharmacists and support team.",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          body: "We use your information to operate our pharmacy and serve you and your pet:",
          list: [
            "To process and fulfill prescription and product orders.",
            "To verify prescriptions with your veterinarian.",
            "To provide personalized medication and product guidance.",
            "To manage AutoShip subscriptions and refill reminders.",
            "To respond to your questions and provide customer support.",
            "To comply with legal, regulatory, and licensing requirements.",
          ],
        },
        {
          heading: "3. Protected Health Information",
          body: "PetRx handles pet health information in accordance with applicable pharmacy regulations. While pets' health records are not protected under HIPAA in the same manner as human health records, we apply industry-standard security measures to safeguard this data. Human health information, where applicable, is handled in compliance with HIPAA requirements.",
        },
        {
          heading: "4. Information Sharing",
          body: "We do not sell your personal information. We share data only as necessary to provide our services:",
          list: [
            "With your prescribing veterinarian, to verify prescriptions.",
            "With shipping carriers, to deliver your orders.",
            "With payment processors, to complete transactions.",
            "When required by law, regulation, or legal process.",
          ],
        },
        {
          heading: "5. Data Security",
          body: "We use encryption, secure servers, and access controls to protect your information. Access to personal and prescription data is restricted to authorized pharmacy staff and is logged for accountability.",
        },
        {
          heading: "6. Cookies and Tracking",
          body: "Our website uses cookies and similar technologies to keep you logged in, remember your preferences, and analyze site traffic. You can control cookies through your browser settings, though some features may not function without them.",
        },
        {
          heading: "7. Your Privacy Choices",
          body: "You may access, correct, or request deletion of your personal information by contacting us. You can unsubscribe from marketing emails at any time using the link in each email. Prescription records are retained as required by pharmacy law and cannot be deleted while a legal retention obligation applies.",
        },
        {
          heading: "8. Children's Privacy",
          body: "Our services are intended for adults. We do not knowingly collect personal information from children under 16. If you believe a minor has provided us information, please contact us so we can remove it.",
        },
        {
          heading: "9. Changes to This Policy",
          body: "We may update this policy from time to time. We will post the updated version here with a revised date. Continued use of our services after changes constitutes acceptance of the updated policy.",
        },
      ]}
    />
  );
}