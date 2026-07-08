import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Stethoscope,
  Truck,
  PawPrint,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Compassion First",
    body: "Every pet is family. We treat your animals with the same care and urgency we would give our own.",
  },
  {
    icon: ShieldCheck,
    title: "Clinical Integrity",
    body: "Licensed pharmacists review every prescription. No shortcuts, no substitutions without your knowledge.",
  },
  {
    icon: Stethoscope,
    title: "Expert Guidance",
    body: "Our team and AI advisor help you understand medications, dosages, and interactions — in plain language.",
  },
  {
    icon: Truck,
    title: "Effortless Refills",
    body: "AutoShip and refill reminders mean you never miss a dose. Free shipping on orders over $49.",
  },
];

const CREDENTIALS = [
  "NABP Accredited",
  "VIPPS Certified",
  "HIPAA Compliant",
  "CA Board of Pharmacy Licensed",
  "FDA-Approved Sources",
];

const TIMELINE = [
  {
    year: "2019",
    title: "A Family Idea",
    body: "PetRx began as a conversation between a veterinarian and a pharmacist frustrated by how hard it was to get pet medications quickly and reliably.",
  },
  {
    year: "2021",
    title: "Licensed & Accredited",
    body: "We earned our California pharmacy license and NABP accreditation, building a fulfillment process designed around prescription safety.",
  },
  {
    year: "2023",
    title: "The Advisor",
    body: "We launched our AI-guided medication advisor, giving pet parents instant, personalized guidance backed by real pharmacy expertise.",
  },
  {
    year: "2026",
    title: "Today",
    body: "PetRx serves thousands of pets across California with a growing catalog of prescription and wellness products — all from a team that loves animals.",
  },
];

export default function About() {
  return (
    <div className="bg-porcelain">
      {/* Hero */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 text-sage text-xs font-semibold tracking-wider uppercase mb-4">
              <PawPrint className="w-4 h-4" /> About PetRx
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-ink mb-5 leading-tight">
              A pharmacy built by people who love pets.
            </h1>
            <p className="text-ink/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              PetRx is a licensed, family-owned veterinary pharmacy on a mission to make pet
              medication management simple, safe, and genuinely human. We pair clinical precision
              with compassionate care — because your pet deserves both.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 md:py-20 px-5 md:px-8 border-y border-border bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sage text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-4 h-4" /> Our Story
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-6 leading-tight">
            From a clinic conversation to a full-service pet pharmacy.
          </h2>
          <div className="space-y-5 text-ink/60 text-base leading-relaxed">
            <p>
              PetRx was born from a simple frustration: getting pet medications was harder than it
              needed to be. Long waits at the clinic, confusing dosages, surprise refills, and no
              one to answer the questions that matter —{" "}
              <em>is this safe with their other medication? How long until it works?</em>
            </p>
            <p>
              We brought together licensed pharmacists and veterinary professionals to build
              something better: a digital pharmacy that treats every prescription with clinical
              rigor, and every pet parent with patience and respect. Every order is reviewed by a
              pharmacist. Every prescription is verified. And every product we carry is selected
              with your pet's wellbeing in mind.
            </p>
            <p>
              Today, we're proud to serve thousands of pets across California — and we're just
              getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sage text-xs font-semibold tracking-wider uppercase mb-4">
            <Award className="w-4 h-4" /> Our Journey
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-10 leading-tight">
            How we got here.
          </h2>
          <div className="relative pl-8 space-y-10 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border">
            {TIMELINE.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-sage border-2 border-white" />
                <div className="text-sage font-display text-lg mb-1">{item.year}</div>
                <h3 className="font-semibold text-ink text-base mb-1.5">{item.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 px-5 md:px-8 border-t border-border bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-sage text-xs font-semibold tracking-wider uppercase mb-3">
              <Heart className="w-4 h-4" /> What We Stand For
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight">
              Four principles behind every prescription.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="cellular-card p-6 md:p-7"
              >
                <div className="w-11 h-11 rounded-full bg-sage/10 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-sage" />
                </div>
                <h3 className="font-display text-lg text-ink mb-2">{value.title}</h3>
                <p className="text-ink/55 text-sm leading-relaxed">{value.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-12 md:py-16 px-5 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sage text-xs font-semibold tracking-wider uppercase mb-4">
            <ShieldCheck className="w-4 h-4" /> Credentials & Trust
          </div>
          <p className="text-ink/50 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            We hold ourselves to the highest standards of pharmacy practice. Our accreditations are
            your assurance of safety, quality, and accountability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {CREDENTIALS.map((cred) => (
              <span
                key={cred}
                className="px-4 py-2.5 bg-white border border-border rounded-full text-xs font-semibold text-ink/70 tracking-wide"
              >
                {cred}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-5 md:px-8 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-4 leading-tight">
            Ready to care for your pet?
          </h2>
          <p className="text-ink/55 text-sm mb-8 max-w-md mx-auto">
            Browse our catalog, talk to the advisor, or set up AutoShip — your pet's pharmacy is one
            click away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
            >
              Shop Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/advisor"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-semibold text-ink hover:border-sage hover:text-sage transition-colors"
            >
              Ask the Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}