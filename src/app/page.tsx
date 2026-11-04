"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Scene from "@/components/Scene";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Projects from "@/components/Projects";
import CopyEmail from "@/components/CopyEmail";
import Expertise from "@/components/Expertise";
import TechStack from "@/components/TechStack";
import GitHubSection from "@/components/GitHubSection";
import {
  CustomCursor,
  ImpactFrame,
  SpeedLines,
  FloatingSigils,
  Atmosphere,
} from "@/components/CinematicOverlays";
import { useLanguage } from "@/components/LanguageContext";
import { site, projects as staticProjects } from "@/lib/data";
import { Github, Mail, ArrowDown } from "lucide-react";

const CHAPTER_IDX: Record<string, number> = {
  prolog: 0, path: 1, expertise: 1.6, jutsu: 2.3,
  missions: 3, github: 3.6, training: 4, contact: 5,
};

const STATIC_GITHUB = {
  login: "AhmadTibyanHakim77",
  name: site.name,
  avatarUrl: "https://avatars.githubusercontent.com/u/277319576?v=4",
  htmlUrl: site.github,
  publicRepos: 14,
  followers: 2,
  location: site.location,
  topLanguages: [
    { language: "TypeScript", count: 6, percentage: 46 },
    { language: "Jupyter Notebook", count: 3, percentage: 23 },
    { language: "Blade (PHP)", count: 2, percentage: 15 },
    { language: "Python", count: 2, percentage: 15 },
  ],
};

export default function HomePage() {
  const { t } = useLanguage();
  const scrollRef = useRef(0);
  const burstRef = useRef(0);
  const chapterRef = useRef(0);
  const impactRef = useRef(false);
  const speedRef = useRef(false);

  // Scroll tracking
  useEffect(() => {
    let lastY = 0;
    let speedTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const maxS = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxS > 0 ? window.scrollY / maxS : 0;
      const delta = Math.abs(window.scrollY - lastY);
      if (delta > 20) {
        speedRef.current = true;
        clearTimeout(speedTimer);
        speedTimer = setTimeout(() => { speedRef.current = false; }, 220);
      }
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chapter detection
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = CHAPTER_IDX[e.target.id] ?? 0;
            if (Math.abs(idx - chapterRef.current) > 0.05) {
              chapterRef.current = idx;
              impactRef.current = true;
            }
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    Object.keys(CHAPTER_IDX).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const onGlobalClick = useCallback(() => {
    burstRef.current = 1.0;
  }, []);

  useEffect(() => {
    window.addEventListener("click", onGlobalClick);
    return () => window.removeEventListener("click", onGlobalClick);
  }, [onGlobalClick]);

  return (
    <>
      {/* ─── 3D Background Scene ─── */}
      <Scene scrollRef={scrollRef} burstRef={burstRef} chapterRef={chapterRef} />

      {/* ─── Overlays ─── */}
      <Atmosphere />
      <FloatingSigils />
      <ImpactFrame triggerRef={impactRef} />
      <SpeedLines activeRef={speedRef} />
      <CustomCursor />

      {/* ─── Navigation ─── */}
      <Nav />

      {/* ─── Main Content ─── */}
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">

        {/* ════════════════════════════════════════
            PROLOG — Hero
            Text LEFT, character RIGHT (desktop)
            Text centered below (mobile)
            Scrim behind text for legibility
        ════════════════════════════════════════ */}
        <section
          id="prolog"
          className="relative flex min-h-screen items-center px-6 md:px-16"
        >
          {/* Text block — left side, with dark radial scrim for legibility */}
          <div className="hero-text-block relative z-10 w-full max-w-xl md:max-w-lg lg:max-w-xl">
            {/* Scrim behind text — dark radial so particles behind don't bleed */}
            <div
              className="absolute -inset-8 rounded-3xl"
              style={{
                background: "radial-gradient(ellipse at 30% 50%, rgba(18,13,10,0.88) 55%, rgba(18,13,10,0.4) 80%, transparent 100%)",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />

            <div className="relative">
              {/* Status badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-dune/30 bg-night/70 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-chakra shadow-[0_0_6px_#ff6a2b]" />
                <span className="font-mono text-xs text-dune">{t.hero.statusBadge}</span>
              </div>

              {/* Sand glyph */}
              <p
                aria-hidden="true"
                className="font-display text-5xl font-extrabold leading-none text-chakra/55 md:text-7xl"
                style={{ textShadow: "0 0 40px rgba(255,106,43,0.5)" }}
              >
                {t.hero.mark}
              </p>

              {/* Name heading — high-contrast, always legible */}
              <h1
                className="mt-2 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight text-sand"
                style={{ textShadow: "0 1px 0 rgba(18,13,10,0.8), 0 2px 20px rgba(18,13,10,0.6)" }}
              >
                {t.hero.titleFirst}
                <br />
                <span className="text-chakra" style={{ textShadow: "0 0 30px rgba(255,106,43,0.4)" }}>
                  {t.hero.titleLast}
                </span>
              </h1>

              {/* Headline */}
              <p
                className="mt-5 max-w-md text-sm leading-relaxed text-sand md:text-base"
                style={{ textShadow: "0 1px 8px rgba(18,13,10,0.9)" }}
              >
                {t.hero.headline}
              </p>

              {/* Role */}
              <p
                className="mt-2 text-xs text-ash md:text-sm"
                style={{ textShadow: "0 1px 6px rgba(18,13,10,0.9)" }}
              >
                {t.hero.role} · {site.location}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#missions"
                  className="inline-flex items-center gap-2 rounded-full bg-chakra px-7 py-3 text-sm font-semibold text-night shadow-[0_0_28px_rgba(255,106,43,0.55)] transition hover:scale-105 hover:shadow-[0_0_44px_rgba(255,106,43,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-chakra"
                >
                  {t.hero.ctaPrimary}
                  <ArrowDown className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-dune/40 bg-night/60 px-6 py-3 text-sm font-medium text-sand backdrop-blur-sm transition hover:border-chakra hover:bg-chakra/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
                >
                  <Mail className="h-4 w-4 text-dune" />
                  {t.hero.ctaSecondary}
                </a>
              </div>

              <p className="mt-8 text-[11px] text-ash/50">{t.hero.sandHint}</p>
            </div>
          </div>

          {/* Scroll chevron */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40" aria-hidden="true">
            <ArrowDown className="h-5 w-5 text-dune" />
          </div>
        </section>

        {/* ════ JALAN — About ════ */}
        <section id="path" className="mx-auto w-[92%] max-w-5xl scroll-mt-20 py-24 md:py-32">
          <Reveal>
            <p className="mb-3 font-display font-semibold tracking-wider text-chakra uppercase">{t.about.chapter}</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-sand sm:text-4xl md:text-5xl">{t.about.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ash md:text-lg">{t.about.lead}</p>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.about.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="glass flex h-full flex-col p-6">
                  <p className="font-display text-3xl font-extrabold text-chakra/40">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-xl font-bold text-sand">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════ KEAHLIAN — Expertise ════ */}
        <Expertise />

        {/* ════ JURUS — Tech Stack ════ */}
        <TechStack />

        {/* ════ MISI — Projects ════ */}
        <section id="missions" className="mx-auto w-[92%] max-w-5xl scroll-mt-20 py-24 md:py-32">
          <Reveal>
            <p className="mb-3 font-display font-semibold tracking-wider text-chakra uppercase">{t.projects.chapter}</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-sand sm:text-4xl md:text-5xl">{t.projects.title}</h2>
            <p className="mt-4 max-w-2xl text-base text-ash md:text-lg">{t.projects.subtitle}</p>
          </Reveal>
          <Projects initialProjects={staticProjects} />
          <div className="mt-10">
            <a href={site.github} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-dune/30 px-5 py-2.5 text-sm text-dune transition hover:border-chakra hover:text-chakra focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra">
              <Github className="h-4 w-4" />
              {t.projects.allReposCta}
            </a>
          </div>
        </section>

        {/* ════ GITHUB ════ */}
        <GitHubSection profile={STATIC_GITHUB} />

        {/* ════ LATIHAN — Process ════ */}
        <section id="training" className="mx-auto w-[92%] max-w-5xl scroll-mt-20 py-24 md:py-32">
          <Reveal>
            <p className="mb-3 font-display font-semibold tracking-wider text-chakra uppercase">{t.training.chapter}</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-sand sm:text-4xl md:text-5xl">{t.training.title}</h2>
            <p className="mt-4 max-w-2xl text-base text-ash md:text-lg">{t.training.subtitle}</p>
          </Reveal>
          <ol className="relative mt-14 space-y-0">
            <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-chakra via-dune/40 to-transparent" aria-hidden="true" />
            {t.training.steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <li className="relative flex items-start gap-6 pb-10 last:pb-0">
                  <div className="relative z-10 mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-chakra/60 bg-night shadow-[0_0_20px_rgba(255,106,43,0.4)]">
                    <span className="font-mono text-xs font-bold text-chakra">{step.num}</span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-display text-xl font-bold text-sand">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ash">{step.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ════ KONTAK — Contact ════ */}
        <section id="contact" className="mx-auto w-[92%] max-w-5xl scroll-mt-20 py-24 text-center md:py-32">
          <Reveal>
            <p className="mb-3 font-display font-semibold tracking-wider text-chakra uppercase">{t.contact.chapter}</p>
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold tracking-tight text-sand sm:text-4xl md:text-5xl"
              style={{ textShadow: "0 0 60px rgba(255,106,43,0.2)" }}>
              {t.contact.title}
            </h2>
            <p className="mt-4 text-ash">{t.contact.subtitle}</p>
            <p className="mt-2 text-sm text-dune">{t.contact.location}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-chakra px-8 py-3.5 text-sm font-semibold text-night shadow-[0_0_28px_rgba(255,106,43,0.5)] transition hover:scale-105 hover:shadow-[0_0_44px_rgba(255,106,43,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra">
                <Mail className="h-4 w-4" />
                {t.contact.sendEmail}
              </a>
              <CopyEmail email={site.email} />
              <a href={site.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-dune/30 px-7 py-3.5 text-sm font-medium text-sand transition hover:border-chakra hover:bg-chakra/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra">
                <Github className="h-4 w-4 text-dune" />
                GitHub
              </a>
            </div>
            <p className="mt-8 font-mono text-xs text-ash/70">{site.email}</p>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-dune/10 bg-night/95 py-10 text-center">
        <p className="text-xs italic text-ash/60">&ldquo;{t.footer.quote}&rdquo;</p>
        <p className="mt-3 text-xs text-ash/50">© {new Date().getFullYear()} {site.name}. {t.footer.rights}</p>
      </footer>
    </>
  );
}
