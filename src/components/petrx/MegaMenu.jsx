import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

const PET_COLUMNS = [
  {
    pet: "dog",
    label: "Dog",
    blurb: "Medications & supplements for dogs",
    items: [
      { label: "Flea, Tick & Heartworm", issue: "fleas" },
      { label: "Pain Relief & Arthritis", issue: "joint" },
      { label: "Skin & Coat", issue: "skin" },
      { label: "Behavior & Anxiety", issue: "behavior" },
      { label: "Allergy Relief", issue: "allergy" },
      { label: "Eye & Ear", issue: "eyeear" },
    ],
  },
  {
    pet: "cat",
    label: "Cat",
    blurb: "Medications & supplements for cats",
    items: [
      { label: "Flea, Tick & Heartworm", issue: "fleas" },
      { label: "Thyroid & Hormones", issue: "thyroid" },
      { label: "Behavior & Anxiety", issue: "behavior" },
      { label: "Skin & Coat", issue: "skin" },
      { label: "Allergy Relief", issue: "allergy" },
      { label: "Vitamins & Supplements", issue: "supplements" },
    ],
  },
  {
    pet: "horse",
    label: "Horse",
    blurb: "Medications & supplements for horses",
    items: [
      { label: "Pain & Inflammation", issue: "joint" },
      { label: "Digestive Health", issue: "digestive" },
      { label: "Skin & Coat", issue: "skin" },
      { label: "Vitamins & Supplements", issue: "supplements" },
    ],
  },
];

const QUICK_LINKS = [
  { label: "All Products", to: "/shop" },
  { label: "Prescription Medications", to: "/shop?type=rx" },
  { label: "OTC Supplements", to: "/shop?type=otc" },
  { label: "Submit a Prescription", to: "/prescription" },
];

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const enter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const leave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button className="flex items-center gap-1 text-sm font-medium text-ink/70 hover:text-ink transition-colors">
        Shop
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(920px,92vw)] z-50"
          >
            <div className="cellular-card p-6 md:p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {PET_COLUMNS.map((col) => (
                  <div key={col.pet}>
                    <Link to={`/shop?pet=${col.pet}`} className="group inline-flex items-center gap-1.5 mb-1">
                      <h3 className="font-display text-lg text-ink group-hover:text-sage transition-colors">{col.label}</h3>
                      <ArrowRight className="w-3.5 h-3.5 text-sage opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <p className="text-xs text-ink/40 mb-4">{col.blurb}</p>
                    <ul className="space-y-2.5">
                      {col.items.map((item) => (
                        <li key={item.issue}>
                          <Link
                            to={`/shop?pet=${col.pet}&issue=${item.issue}`}
                            className="text-sm text-ink/60 hover:text-sage transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-x-6 gap-y-2">
                {QUICK_LINKS.map((q) => (
                  <Link key={q.label} to={q.to} className="text-xs font-semibold text-sage hover:underline">
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}