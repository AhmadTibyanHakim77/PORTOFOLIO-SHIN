"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { stackCategories } from "@/lib/data";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import {
  Code2,
  Layout,
  Server,
  Database,
  BarChart3,
  Binary,
  Cpu,
  BrainCircuit,
  Wrench,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Layout,
  Server,
  Database,
  BarChart3,
  Binary,
  Cpu,
  BrainCircuit,
  Wrench,
};

export default function TechStack() {
  const { locale, t } = useLanguage();

  return (
    <section id="jutsu" className="mx-auto w-[92%] max-w-5xl scroll-mt-20 py-24 md:py-32">
      <Reveal>
        <p className="mb-3 font-display font-semibold tracking-wider text-chakra uppercase">
          {t.stack.chapter}
        </p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-sand sm:text-4xl md:text-5xl">
          {t.stack.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ash md:text-lg">
          {t.stack.subtitle}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stackCategories.map((cat, idx) => {
          const Icon = iconMap[cat.iconName] || Code2;
          const title = cat.title[locale] || cat.title.en;

          return (
            <Reveal key={cat.iconName} delay={idx * 0.06}>
              <TiltCard className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-dune/25 bg-dune/10 text-dune">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-sand">
                    {title}
                  </h3>
                </div>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {cat.items.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-dune/20 bg-night/40 px-3 py-1 font-mono text-xs text-sand/90 transition-all duration-200 hover:border-chakra hover:bg-chakra/15 hover:text-sand"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

