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
            "Usage data: pages visited, device type, and approximate location derived from IP address, used to improve site performance and security.",
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
            "To detect and prevent fraud, abuse, and unauthorized access.",
            "To comply with legal, regulatory, and licensing requirements.",
          ],
        },
        {
          heading: "3. Legal Bases for Processing",
          body: "We process your personal information under the following lawful bases: to perform our contract with you (fulfilling orders and prescriptions), to comply with legal and regulatory obligations (pharmacy record-keeping), and to pursue our legitimate interests in operating a safe and efficient pharmacy (security, fraud prevention, and service improvement). Where we rely on your consent — for example, for marketing emails — you may withdraw it at any time.",
        },
        {
          heading: "4. Protected Health Information",
          body: "PetRx handles pet health information in accordance with applicable pharmacy regulations. While pets' health records are not protected under HIPAA in the same manner as human health records, we apply industry-standard security measures to safeguard this data. Human health information, where applicable, is handled in compliance with HIPAA requirements.",
        },
        {
          heading: "5. Information Sharing",
          body: "We do not sell your personal information. We share data only as necessary to provide our services:",
          list: [
            "With your prescribing veterinarian, to verify prescriptions.",
            "With shipping carriers, to deliver your orders.",
            "With payment processors, to complete transactions.",
            "With hosting and analytics providers, under contracts that require them to protect your data.",
            "When required by law, regulation, or legal process.",
          ],
        },
        {
          heading: "6. Data Retention",
          body: "We retain your information for as long as your account is active and for as long thereafter as needed to comply with legal, regulatory, and pharmacy board record-retention requirements. Prescription records are typically retained for a minimum period prescribed by state pharmacy law. Non-prescription data is deleted or anonymized when it is no longer needed for the purposes described in this policy.",
        },
        {
          heading: "7. Data Security",
          body: "We use encryption in transit and at rest, secure servers, role-based access controls, and regular security reviews to protect your information. Access to personal and prescription data is restricted to authorized pharmacy staff and is logged for accountability. While no system is perfectly secure, we continuously work to safeguard your data.",
        },
        {
          heading: "8. Cookies and Tracking",
          body: "Our website uses cookies and similar technologies to keep you logged in, remember your preferences, and analyze site traffic. You can control cookies through your browser settings, though some features may not function without them. We do not use cookies to sell your personal information to third parties.",
        },
        {
          heading: "9. Third-Party Links and Services",
          body: "Our site may contain links to third-party websites (such as veterinary clinics or product manufacturers) that we do not control. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.",
        },
        {
          heading: "10. Your Privacy Choices",
          body: "You have the following rights and options regarding your personal information:",
          list: [
            "Access and receive a copy of the personal information we hold about you.",
            "Correct inaccurate or incomplete information.",
            "Request deletion of personal information, subject to legal retention obligations.",
            "Opt out of marketing communications at any time via the unsubscribe link in each email.",
            "Disable cookies through your browser settings.",
            "Limit the use of sensitive personal information for purposes beyond providing our core pharmacy services.",
          ],
        },
        {
          heading: "11. Do Not Track Signals",
          body: "Some browsers offer a 'Do Not Track' signal. Because there is no uniform standard for how these signals should be interpreted, we do not currently alter our practices in response to them. We do, however, honor the cookie and marketing preferences described above.",
        },
        {
          heading: "12. Children's Privacy",
          body: "Our services are intended for adults. We do not knowingly collect personal information from children under 16. If you believe a minor has provided us information, please contact us so we can remove it.",
        },
        {
          heading: "13. International Users",
          body: "PetRx is a United States-based pharmacy. If you access our services from outside the U.S., your information will be transferred to and processed in the United States, where privacy laws may differ from those in your jurisdiction. By using our services, you consent to this transfer.",
        },
        {
          heading: "14. Changes to This Policy",
          body: "We may update this policy from time to time. We will post the updated version here with a revised date. If we make material changes, we may also notify you by email or through the site. Continued use of our services after changes constitutes acceptance of the updated policy.",
        },
      ]}
    />
  );
}