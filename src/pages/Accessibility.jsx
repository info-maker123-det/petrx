import React from "react";
import LegalPage from "@/components/petrx/LegalPage";

export default function Accessibility() {
  return (
    <LegalPage
      eyebrow="Accessibility"
      title="Accessibility Statement"
      lastUpdated="July 8, 2026"
      intro="PetRx Pharmacy is committed to making our website accessible and usable for everyone, including people with disabilities. We continuously work to improve the experience and meet recognized accessibility standards."
      sections={[
        {
          heading: "1. Our Commitment",
          body: "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities, and we use them as the benchmark for our design and development.",
        },
        {
          heading: "2. What We Do",
          body: "To support an accessible experience, we:",
          list: [
            "Use sufficient color contrast between text and background.",
            "Provide text alternatives and descriptive labels for images and controls.",
            "Structure pages with clear headings so they can be navigated by screen readers.",
            "Ensure all interactive elements can be used with a keyboard alone.",
            "Keep forms labeled and error messages clear and descriptive.",
            "Design layouts that adapt to different screen sizes and zoom levels.",
          ],
        },
        {
          heading: "3. Ongoing Efforts",
          body: "Accessibility is an ongoing process. We review our site regularly, test with assistive technologies, and make improvements as we identify issues or receive feedback. New features and content are evaluated against our accessibility standards before launch.",
        },
        {
          heading: "4. Third-Party Content",
          body: "Some pages may include content or tools provided by third parties, such as payment forms or maps. While we choose partners who share our commitment to accessibility, we cannot guarantee the accessibility of third-party content outside our control.",
        },
        {
          heading: "5. Need Help?",
          body: "If you have trouble accessing any part of our website, or if you'd like to share feedback, we want to know. Please contact us and we will work to provide the information or service you need in an accessible way.",
        },
        {
          heading: "6. Compatibility",
          body: "Our site is designed to be compatible with commonly used browsers and assistive technologies, including screen readers and voice recognition software. If you encounter a compatibility issue, let us know which device, browser, and assistive technology you are using so we can investigate.",
        },
      ]}
    />
  );
}