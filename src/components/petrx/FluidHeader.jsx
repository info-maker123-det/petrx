import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, Phone, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cartContext";
import Logo from "@/components/petrx/Logo";
import MegaMenu from "@/components/petrx/MegaMenu";

const NAV_LINKS = [
  { label: "Shop", type: "route", target: "/shop" },
  { label: "Pharmacy", type: "section", target: "#products" },
  { label: "AutoShip", type: "section", target: "#autoship" },
  { label: "Prescriptions", type: "route", target: "/prescription" },
  { label: "About", type: "section", target: "#why-petrx" },
  { label: "Contact", type: "route", target: "/contact" },
];

export default function FluidHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSectionClick = (e, target) => {
    e.preventDefault();
    setMobileOpen(false);
    if (window.location.pathname === "/") {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + target);
    }
  };

  const handleRouteClick = () => setMobileOpen(false);

  const renderNavLinks = (mobile = false) =>
    NAV_LINKS.map((link) =>
      link.type === "route" ? (
        <Link
          key={link.label}
          to={link.target}
          onClick={handleRouteClick}
          className={`text-sm font-medium text-ink/70 hover:text-ink transition-colors ${
            mobile ? "block py-3 px-4 hover:bg-secondary rounded-xl" : ""
          }`}
        >
          {link.label}
        </Link>
      ) : (
        <a
          key={link.label}
          href={link.target}
          onClick={(e) => handleSectionClick(e, link.target)}
          className={`text-sm font-medium text-ink/70 hover:text-ink transition-colors ${
            mobile ? "block py-3 px-4 hover:bg-secondary rounded-xl" : ""
          }`}
        >
          {link.label}
        </a>
      )
    );

  return (
    <>
      {/* Trust Strip */}
      <div className="bg-[#1A1C1E] text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sage" /> Licensed CA Pharmacy
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-white/50">Pharmacist-Verified</span>
            <span className="hidden md:flex items-center gap-1.5 text-white/50">HIPAA-Secure</span>
          </div>
          <a href="tel:+18885551234" className="flex items-center gap-1.5 text-white/70 hover:text-sage transition-colors">
            <Phone className="w-3.5 h-3.5" /> (888) 555-1234
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 bg-porcelain/95 backdrop-blur-md ${
          scrolled ? "shadow-sm border-b border-border py-3" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between gap-6">
          {/* Logo */}
          <Logo className={`transition-all duration-500 ${scrolled ? "scale-90" : "scale-100"}`} />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <MegaMenu />
            {NAV_LINKS.filter((l) => l.label !== "Shop").map((link) =>
              link.type === "route" ? (
                <Link key={link.label} to={link.target} onClick={handleRouteClick} className="text-sm font-medium text-ink/70 hover:text-ink transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.target} onClick={(e) => handleSectionClick(e, link.target)} className="text-sm font-medium text-ink/70 hover:text-ink transition-colors">
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Search + Account + Cart */}
          <div className="flex items-center gap-3">
            <motion.div
              className={`hidden md:flex items-center transition-all duration-500 ${
                scrolled ? "w-48" : "w-40"
              }`}
              layout
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
                <input
                  type="text"
                  placeholder={scrolled ? "Search medications..." : "Search"}
                  className="w-full pl-9 pr-4 py-2 bg-secondary rounded-xl text-sm border border-transparent focus:border-sage focus:outline-none transition-all placeholder:text-muted-foreground"
                />
              </div>
            </motion.div>

            <Link
              to="/dashboard"
              className="hidden lg:inline-flex items-center px-5 py-2 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-ink/90 transition-colors"
            >
              My Account
            </Link>

            <button onClick={openCart} className="relative p-2 hover:bg-secondary rounded-xl transition-colors">
              <ShoppingBag className="w-5 h-5 text-ink" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sage text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-secondary rounded-xl transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="px-5 py-6 space-y-1">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
                  <input
                    type="text"
                    placeholder="Search medications..."
                    className="w-full pl-9 pr-4 py-3 bg-secondary rounded-xl text-sm border border-transparent focus:border-sage focus:outline-none"
                  />
                </div>
                {renderNavLinks(true)}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-4 mt-2 bg-ink text-white rounded-xl text-sm font-semibold text-center"
                >
                  My Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}