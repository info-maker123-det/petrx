import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cartContext";

const NAV_LINKS = [
  { label: "Shop", type: "section", target: "#shop-by-pet" },
  { label: "Pharmacy", type: "section", target: "#products" },
  { label: "AutoShip", type: "section", target: "#autoship" },
  { label: "About", type: "section", target: "#why-petrx" },
  { label: "Prescriptions", type: "route", target: "/prescription" },
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
          className={`text-sm font-medium text-ink/70 hover:text-ink transition-colors tracking-wide uppercase ${
            mobile ? "block py-3 px-4 hover:bg-secondary rounded-2xl" : ""
          }`}
        >
          {link.label}
        </Link>
      ) : (
        <a
          key={link.label}
          href={link.target}
          onClick={(e) => handleSectionClick(e, link.target)}
          className={`text-sm font-medium text-ink/70 hover:text-ink transition-colors tracking-wide uppercase ${
            mobile ? "block py-3 px-4 hover:bg-secondary rounded-2xl" : ""
          }`}
        >
          {link.label}
        </a>
      )
    );

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-[#1A1C1E] text-white text-center py-2.5 px-4 text-sm font-body tracking-wide">
        Save 20% on your first AutoShip with code <span className="font-semibold">FAMILY20</span>
        <span className="mx-2 text-white/40">|</span>
        <a href="#autoship" className="underline underline-offset-2 hover:text-sage transition-colors">Learn More</a>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 bg-porcelain ${
          scrolled ? "shadow-sm py-2" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-all duration-500">
            <h1
              className={`font-display text-ink tracking-tight transition-all duration-500 ${
                scrolled ? "text-xl" : "text-3xl"
              }`}
            >
              Pet<span className="text-sage">Rx</span>
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {renderNavLinks()}
          </nav>

          {/* Search + Cart */}
          <div className="flex items-center gap-4">
            <motion.div
              className={`hidden md:flex items-center transition-all duration-500 ${
                scrolled ? "w-64" : "w-44"
              }`}
              layout
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
                <input
                  type="text"
                  placeholder={scrolled ? "Search medications..." : "Search"}
                  className="w-full pl-9 pr-4 py-2 bg-secondary rounded-full text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all placeholder:text-muted-foreground"
                />
              </div>
            </motion.div>

            <button onClick={openCart} className="relative p-2 hover:bg-secondary rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-ink" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sage text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors"
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
                    className="w-full pl-9 pr-4 py-3 bg-secondary rounded-full text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
                  />
                </div>
                {renderNavLinks(true)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}