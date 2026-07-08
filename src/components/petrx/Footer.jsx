import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "@/components/petrx/Logo";

const PHARMACY_LINKS = [
  { label: "Dog Medications", href: "#products" },
  { label: "Cat Medications", href: "#products" },
  { label: "Horse Supplements", href: "#products" },
  { label: "Flea & Tick", href: "#products" },
  { label: "Heartworm Prevention", href: "#products" },
  { label: "Joint & Pain", href: "#products" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "#why-petrx" },
  { label: "How It Works", href: "#" },
  { label: "AutoShip Program", href: "#autoship" },
  { label: "Prescription Policy", href: "#" },
  { label: "Shipping & Returns", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Accessibility", to: "/accessibility" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1C1E] text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-white mb-2">
              Your pet's pharmacy, simplified.
            </h3>
            <p className="text-white/40 text-base">
              Create a free account to manage prescriptions, pets, and deliveries in one secure place.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full font-semibold text-base hover:bg-[#3d5a66] transition-colors flex-shrink-0"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo onDark />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Your trusted family-owned pet pharmacy. Licensed, accredited, and committed to your pet's health.
            </p>
            <div className="space-y-3">
              <a href="tel:+18885551234" className="flex items-center gap-2.5 text-white/50 hover:text-sage transition-colors text-sm">
                <Phone className="w-4 h-4" /> (888) 555-1234
              </a>
              <a href="mailto:care@petrx.com" className="flex items-center gap-2.5 text-white/50 hover:text-sage transition-colors text-sm">
                <Mail className="w-4 h-4" /> care@petrx.com
              </a>
              <div className="flex items-start gap-2.5 text-white/50 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> California, United States
              </div>
            </div>
          </div>

          {/* Pharmacy */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Pharmacy</h4>
            <ul className="space-y-3">
              {PHARMACY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/40 hover:text-sage transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/40 hover:text-sage transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Stay Updated</h4>
            <p className="text-white/40 text-sm mb-4">
              Pet health tips, exclusive deals, and new product alerts.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/[0.06] border-[0.5px] border-white/10 rounded-l-2xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sage"
              />
              <button className="px-5 py-3 bg-sage text-white rounded-r-2xl text-sm font-semibold hover:bg-[#3d5a66] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Strip */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {["NABP Accredited", "VIPPS Certified", "HIPAA Compliant", "CA Board of Pharmacy Licensed", "FDA-Approved Sources"].map((cred) => (
            <span key={cred} className="text-white/30 text-xs font-medium tracking-wide uppercase">{cred}</span>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 PetRx Pharmacy. All rights reserved. Licensed Pet Pharmacy — California.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="text-white/30 hover:text-white/60 transition-colors text-xs">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}