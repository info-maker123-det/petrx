import React from "react";
import LegalPage from "@/components/petrx/LegalPage";

export default function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Terms of Service"
      title="Terms of Service"
      lastUpdated="July 8, 2026"
      intro="These terms govern your use of the PetRx Pharmacy website and services. By creating an account or placing an order, you agree to these terms."
      sections={[
        {
          heading: "1. Overview of Services",
          body: "PetRx is a licensed California veterinary pharmacy providing prescription medications, over-the-counter supplements, and related pharmacy services for pets. Our services include prescription verification, order fulfillment, AutoShip subscriptions, and pharmacist-guided product recommendations.",
        },
        {
          heading: "2. Eligibility",
          body: "You must be at least 18 years old and legally able to enter into contracts to use our services. By placing an order, you confirm that you are the pet owner or an authorized caretaker.",
        },
        {
          heading: "3. Accounts",
          body: "You are responsible for maintaining the accuracy of your account information and for keeping your password confidential. You agree to notify us of any unauthorized use of your account. We may suspend or terminate accounts that violate these terms or that we suspect are being used fraudulently.",
        },
        {
          heading: "4. Prescriptions",
          body: "Prescription medications require a valid prescription from a licensed veterinarian. We verify every prescription before dispensing.",
          list: [
            "You must provide accurate pet and veterinarian information so we can verify the prescription.",
            "Prescriptions are reviewed by a licensed pharmacist and may be approved, held for clarification, or rejected.",
            "It is your responsibility to ensure your veterinarian is reachable and authorized to prescribe in your jurisdiction.",
            "We reserve the right to refuse to fill any prescription that appears invalid, expired, or inconsistent with safe pharmacy practice.",
          ],
        },
        {
          heading: "5. Orders, Pricing, and Payment",
          body: "All orders are subject to acceptance and product availability. Prices are listed on the website and may change without notice. Payment is processed at checkout through our secure payment provider. If a prescription cannot be verified, we will notify you and may cancel or hold the affected items. In the event of a pricing error, we may cancel an order and offer a refund or the option to re-order at the correct price.",
        },
        {
          heading: "6. AutoShip Subscriptions",
          body: "AutoShip allows you to schedule recurring deliveries of eligible products at a discounted rate.",
          list: [
            "Subscriptions can be paused, modified, or cancelled at any time before the next scheduled shipment.",
            "You authorize us to process payment for each scheduled shipment until you cancel.",
            "Prescription items on AutoShip remain subject to ongoing prescription validity and pharmacist review.",
            "We may notify you before each shipment so you can make changes or skip a delivery.",
          ],
        },
        {
          heading: "7. Shipping and Returns",
          body: "Free shipping applies to orders over $49. Shipping times are estimates and not guaranteed. Due to the nature of pharmacy products, returns of prescription medications are not accepted once dispensed, except where required by law. Supplement returns may be accepted within 30 days if unopened and in original packaging. Shipping and handling fees are non-refundable except where required by law.",
        },
        {
          heading: "8. Advisor and Product Guidance",
          body: "Our AI advisor and pharmacist recommendations are provided for informational purposes and do not replace veterinary diagnosis or treatment. You should always consult your veterinarian before starting, stopping, or changing any medication. PetRx is not liable for outcomes resulting from reliance on advisory guidance without veterinary consultation.",
        },
        {
          heading: "9. User Conduct",
          body: "You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others. You will not:",
          list: [
            "Provide false, inaccurate, or misleading pet or prescription information.",
            "Attempt to obtain medications without a valid prescription.",
            "Use the site to transmit viruses, malware, or harmful code.",
            "Interfere with the security or operation of the site.",
            "Scrape, copy, or redistribute site content without permission.",
          ],
        },
        {
          heading: "10. Intellectual Property",
          body: "All content on this site, including text, graphics, logos, and product information, is the property of PetRx or its licensors and is protected by copyright and trademark law. You may not reproduce or redistribute our content without prior written permission.",
        },
        {
          heading: "11. Disclaimers",
          body: "Our services are provided 'as is' and 'as available.' We do not warrant that the site will be uninterrupted, error-free, or secure at all times. Product descriptions, availability, and pricing are subject to change. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability and fitness for a particular purpose.",
        },
        {
          heading: "12. Limitation of Liability",
          body: "To the fullest extent permitted by law, PetRx is not liable for indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability for any claim is limited to the amount you paid for the relevant order. This does not affect rights that cannot be excluded under applicable law.",
        },
        {
          heading: "13. Indemnification",
          body: "You agree to indemnify and hold PetRx, its officers, employees, and pharmacists harmless from claims, damages, and expenses (including reasonable legal fees) arising from your misuse of the services, your violation of these terms, or your provision of inaccurate or unlawful information.",
        },
        {
          heading: "14. Force Majeure",
          body: "We are not liable for delays or failures to perform caused by circumstances beyond our reasonable control, including natural disasters, pandemics, supply chain disruptions, government actions, or failures of third-party providers.",
        },
        {
          heading: "15. Governing Law and Disputes",
          body: "These terms are governed by the laws of the State of California. Any disputes will be resolved in the courts located in California, unless you are a consumer with mandatory rights in your home jurisdiction. We will attempt to resolve disputes informally before initiating formal proceedings where practicable.",
        },
        {
          heading: "16. Changes to These Terms",
          body: "We may update these terms from time to time. We will post the updated version here with a revised date. Your continued use of the services after changes constitutes acceptance of the updated terms.",
        },
        {
          heading: "17. Severability",
          body: "If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.",
        },
        {
          heading: "18. Entire Agreement",
          body: "These terms, together with our Privacy Policy and any policies referenced herein, constitute the entire agreement between you and PetRx regarding the use of our services.",
        },
      ]}
    />
  );
}