import React from "react";
import { motion } from "framer-motion";
import { Calendar, RefreshCw, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AUTOSHIP_IMG = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/a058ef8a1_generated_3950012b.png";

const BENEFITS = [
  { icon: DollarSign, title: "20% Off First Order", desc: "Save big on your first AutoShip delivery with code FAMILY20." },
  { icon: RefreshCw, title: "5% Off Every Refill", desc: "Ongoing savings on every recurring delivery after the first." },
  { icon: Calendar, title: "You Set the Schedule", desc: "Choose your frequency — not just monthly. Change or cancel anytime." },
];

export default function AutoShipSection() {
  return (
    <section id="autoship" className="py-24 md:py-36 bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Image — 2/5 width */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <div className="cellular-card overflow-hidden">
              <img
                src={AUTOSHIP_IMG}
                alt="Happy labrador puppy with soulful brown eyes"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </motion.div>

          {/* Content — 3/5 width */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Subscribe & Save</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink mb-6 leading-tight">
              AutoShip:<br />
              <span className="text-sage italic">Set It & Forget It</span>
            </h2>
            <p className="text-ink/50 text-base mb-10 max-w-lg leading-relaxed">
              Never run out of your pet's essential medications. AutoShip delivers what they need,
              when they need it — with savings on every order and no commitment.
            </p>

            {/* Benefits */}
            <div className="space-y-6 mb-10">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <h4 className="text-ink font-semibold text-base mb-0.5">{title}</h4>
                    <p className="text-ink/50 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link to="/autoship" className="autoship-pulse inline-flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full font-semibold text-base hover:bg-[#3d5a66] transition-colors">
              Start AutoShip
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}