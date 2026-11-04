"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const { t, locale, toggleLocale } = useLanguage();
  const [active, setActive] = useState("prolog");
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const springProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  const chapters: [string, string][] = [
    ["prolog", t.nav.prolog],
    ["path", t.nav.path],
    ["expertise", t.nav.expertise],
    ["jutsu", t.nav.jutsu],
    ["missions", t.nav.missions],
    ["training", t.nav.training],
    ["contact", t.nav.contact],
  ];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    chapters.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Close mobile menu on nav click
  const handleNavClick = () => setMenuOpen(false);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-chakra focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-night"
      >
        {t.nav.skipLink}
      </a>

      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: springProgress }}
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-gradient-to-r from-ember via-chakra to-dune shadow-[0_0_12px_#ff6a2b88]"
        aria-hidden="true"
      />

      {/* Desktop Nav */}
      <nav
        aria-label="Navigasi bab"
        className="glass fixed inset-x-0 top-4 z-40 mx-auto hidden w-[94%] max-w-4xl items-center justify-between px-4 py-2 md:flex"
      >
        <span className="font-display text-sm font-bold text-chakra tracking-wider">
          ATH
        </span>

        <div className="flex items-center gap-1">
          {chapters.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                active === id
                  ? "bg-chakra/25 text-sand shadow-[0_0_10px_rgba(255,106,43,0.25)]"
                  : "text-ash hover:text-sand"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Language Toggle */}
        <button
          type="button"
          onClick={toggleLocale}
          className="rounded-full border border-dune/30 px-3 py-1.5 font-mono text-xs font-semibold text-dune transition hover:border-chakra hover:text-chakra focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
          aria-label={`Switch language to ${locale === "id" ? "English" : "Bahasa Indonesia"}`}
        >
          {t.nav.langToggle}
        </button>
      </nav>

      {/* Mobile Nav Trigger */}
      <div className="glass fixed inset-x-0 top-4 z-40 mx-auto flex w-[94%] items-center justify-between px-4 py-2 md:hidden">
        <span className="font-display text-sm font-bold text-chakra tracking-wider">ATH</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-full border border-dune/30 px-3 py-1.5 font-mono text-xs font-semibold text-dune transition hover:border-chakra hover:text-chakra focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
          >
            {t.nav.langToggle}
          </button>
          <button
            type="button"
            aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full border border-dune/30 p-2 text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigasi bab"
          className="fixed inset-0 z-[45] bg-night/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
            {chapters.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={handleNavClick}
                className={`text-2xl font-display font-bold tracking-tight transition-all duration-200 ${
                  active === id ? "text-chakra" : "text-ash hover:text-sand"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
