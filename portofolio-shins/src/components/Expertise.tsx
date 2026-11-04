"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import TiltCard from "./TiltCard";
import Reveal from "./Reveal";
import {
  Layers,
  Smartphone,
  Database,
  Network,
  Cpu,
  BarChart2,
} from "lucide-react";

const icons = [Layers, Smartphone, Database, Network, Cpu, BarChart2];

export default function Expertise() {
  const { t } = useLanguage();

  return (
    <section id="expertise" className="mx-auto w-[92%] max-w-5xl scroll-mt-20 py-24 md:py-32">
      <Reveal>
        <p className="mb-3 font-display font-semibold tracking-wider text-chakra uppercase">
          {t.expertise.chapter}
        </p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-sand sm:text-4xl md:text-5xl">
          {t.expertise.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ash md:text-lg">
          {t.expertise.subtitle}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.expertise.items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <Reveal key={item.id} delay={index * 0.08}>
              <TiltCard className="flex h-full flex-col p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-chakra/30 bg-chakra/10 text-chakra shadow-[0_0_15px_rgba(255,106,43,0.2)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-dune/60">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold tracking-tight text-sand group-hover:text-chakra transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">
                  {item.desc}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-dune/15 pt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-dune/10 border border-dune/20 px-2.5 py-0.5 font-mono text-[11px] text-dune/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

