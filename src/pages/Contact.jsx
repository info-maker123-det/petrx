import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Phone, Mail, MapPin, Clock, MessageSquare, Check, ArrowRight } from "lucide-react";

const METHODS = [
  { icon: Phone, label: "Call Us", value: "(888) 555-1234", href: "tel:+18885551234" },
  { icon: Mail, label: "Email Us", value: "care@petrx.com", href: "mailto:care@petrx.com" },
  { icon: MapPin, label: "Visit Us", value: "California, United States", href: null },
  { icon: Clock, label: "Hours", value: "Mon–Fri 8am–6pm PT", href: null },
];

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const valid = form.name && form.email && form.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!valid) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.ContactMessage.create({ ...form, status: "new" });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again or call us directly.");
    }
    setSubmitting(false);
  };

  return (
    <div className="py-12 md:py-16 bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Get in Touch</p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink mb-4">We're Here to Help</h1>
          <p className="text-ink/50 max-w-md mx-auto">
            Questions about your pet's medication, prescription, or order? Our team of pharmacists is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Methods */}
          <div className="space-y-4">
            {METHODS.map(({ icon: Icon, label, value, href }, i) => {
              const content = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="cellular-card p-6 flex items-center gap-4 hover:border-sage/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="text-xs text-ink/40 uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-ink font-semibold">{value}</p>
                  </div>
                </motion.div>
              );
              return href ? (
                <a key={label} href={href} className="block">
                  {content}
                </a>
              ) : (
                <div key={label}>{content}</div>
              );
            })}

            <div className="cellular-card p-6 bg-sage/5">
              <h3 className="font-display text-lg text-ink mb-2">Speak with a Pharmacist</h3>
              <p className="text-sm text-ink/50 mb-4">
                Need guidance on your pet's prescription? Our licensed pharmacists offer free consultations.
              </p>
              <a href="tel:+18885551234" className="inline-flex items-center gap-2 text-sage text-sm font-semibold hover:gap-3 transition-all">
                Request a Consult <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="cellular-card p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="font-display text-xl text-ink mb-2">Message Sent</h3>
                <p className="text-sm text-ink/50 mb-6">We'll get back to you within one business day.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-sage" />
                  <h2 className="font-display text-xl text-ink">Send a Message</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all resize-none" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-sage text-white rounded-full font-semibold text-sm hover:bg-[#3d5a66] transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending..." : <>Send Message <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}