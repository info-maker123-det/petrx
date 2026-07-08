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
          body: "You are responsible for maintaining the accuracy of your account information and for keeping your password confidential. You agree to notify us of any unauthorized use of your account.",
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
          body: "All orders are subject to acceptance and product availability. Prices are listed on the website and may change without notice. Payment is processed at checkout through our secure payment provider. If a prescription cannot be verified, we will notify you and may cancel or hold the affected items.",
        },
        {
          heading: "6. AutoShip Subscriptions",
          body: "AutoShip allows you to schedule recurring deliveries of eligible products at a discounted rate.",
          list: [
            "Subscriptions can be paused, modified, or cancelled at any time before the next scheduled shipment.",
            "You authorize us to process payment for each scheduled shipment until you cancel.",
            "Prescription items on AutoShip remain subject to ongoing prescription validity and pharmacist review.",
          ],
        },
        {
          heading: "7. Shipping and Returns",
          body: "Free shipping applies to orders over $49. Shipping times are estimates and not guaranteed. Due to the nature of pharmacy products, returns of prescription medications are not accepted once dispensed, except where required by law. Supplement returns may be accepted within 30 days if unopened and in original packaging.",
        },
        {
          heading: "8. Advisor and Product Guidance",
          body: "Our AI advisor and pharmacist recommendations are provided for informational purposes and do not replace veterinary diagnosis or treatment. You should always consult your veterinarian before starting, stopping, or changing any medication.",
        },
        {
          heading: "9. Intellectual Property",
          body: "All content on this site, including text, graphics, logos, and product information, is the property of PetRx or its licensors and is protected by copyright and trademark law. You may not reproduce or redistribute our content without permission.",
        },
        {
          heading: "10. Limitation of Liability",
          body: "To the fullest extent permitted by law, PetRx is not liable for indirect, incidental, or consequential damages arising from your use of our services. Our total liability for any claim is limited to the amount you paid for the relevant order. This does not affect rights that cannot be excluded under applicable law.",
        },
        {
          heading: "11. Governing Law",
          body: "These terms are governed by the laws of the State of California. Any disputes will be resolved in the courts located in California, unless you are a consumer with mandatory rights in your home jurisdiction.",
        },
        {
          heading: "12. Changes to These Terms",
          body: "We may update these terms from time to time. We will post the updated version here with a revised date. Your continued use of the services after changes constitutes acceptance of the updated terms.",
        },
      ]}
    />
  );
}