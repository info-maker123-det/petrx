import React from "react";
import LegalPage from "@/components/petrx/LegalPage";

export default function ShippingReturns() {
  return (
    <LegalPage
      eyebrow="Fulfillment"
      title="Shipping & Returns"
      lastUpdated="July 8, 2026"
      intro="Everything you need to know about how your pet's medications arrive — and what to do if something isn't right. All orders ship from our licensed California pharmacy."
      sections={[
        {
          heading: "1. Shipping Methods & Timeframes",
          body: "We process and ship prescriptions only after a licensed pharmacist has reviewed and approved them. Orders placed before 2 PM PT (Monday–Friday) typically ship the same business day.",
          list: [
            "Standard Shipping (3–5 business days): Free on orders over $49; otherwise $5.95.",
            "Expedited Shipping (2 business days): $14.95.",
            "Overnight Shipping (next business day if ordered before 2 PM PT): $29.95.",
            "AutoShip orders always ship free, regardless of order total.",
          ],
        },
        {
          heading: "2. Temperature-Controlled Delivery",
          body: "Many pet medications are sensitive to heat and cold. For items that require it, we use insulated packaging and cold packs to maintain product integrity during transit. Temperature-sensitive shipments are dispatched Monday–Wednesday to avoid weekend delays.",
        },
        {
          heading: "3. Where We Ship",
          body: "As a nationwide-licensed pharmacy, we ship to all 50 U.S. states. We do not currently ship internationally or to U.S. territories. Certain refrigerated medications may have restricted delivery zones during extreme weather — we'll notify you if your order is affected.",
        },
        {
          heading: "4. Order Tracking",
          body: "As soon as your order leaves our pharmacy, you'll receive a confirmation email with a tracking number. You can also view live status updates for every order from your account dashboard at any time.",
        },
        {
          heading: "5. Returns & Refunds",
          body: "By law, we cannot accept returns or offer refunds on prescription medications once they have been dispensed and shipped. This protects your pet's safety and complies with federal pharmacy regulations.",
          subsections: [
            { heading: "Damaged or Incorrect Items", body: "If your order arrives damaged, with the wrong item, or with a broken seal, contact us within 48 hours of delivery. We'll arrange a replacement or refund at no cost to you." },
            { heading: "Non-Prescription Items", body: "Unopened over-the-counter supplements and wellness products may be returned within 30 days of delivery for a full refund, provided the packaging is sealed and in original condition. Return shipping is the customer's responsibility unless the item was damaged or shipped in error." },
            { heading: "Refund Processing", body: "Approved refunds are issued to the original payment method within 5–7 business days of receiving the returned item or confirming the issue." },
          ],
        },
        {
          heading: "6. Lost or Delayed Shipments",
          body: "If your tracking hasn't updated in 3 business days, or your package is marked delivered but you haven't received it, contact our pharmacy team right away. We'll open a carrier investigation and, if needed, reship your order at no charge.",
        },
        {
          heading: "7. Address Accuracy",
          body: "Please double-check your shipping address at checkout. We are not responsible for deliveries to an incorrect or incomplete address provided at the time of order. If an error is caught before shipment, contact us immediately and we'll do our best to update it.",
        },
      ]}
    />
  );
}