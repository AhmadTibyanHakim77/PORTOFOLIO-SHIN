"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Cat, type ProjectItem } from "@/lib/data";
import { useLanguage } from "./LanguageContext";
import ProjectArtwork from "./ProjectArtwork";
import TiltCard from "./TiltCard";
import { ExternalLink, Github, Star, GitFork, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface ProjectsProps {
  initialProjects?: ProjectItem[];
}

export default function Projects({ initialProjects }: ProjectsProps) {
  const { locale, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<Cat | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const projectList = initialProjects || [];

  const filtered = projectList.filter(
    (p) => activeFilter === "all" || p.cat === activeFilter
  );

  const tabs: [Cat | "all", string][] = [
    ["all", t.projects.all],
    ["web", t.projects.web],
    ["ai", t.projects.ai],
    ["data", t.projects.data],
  ];

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Category Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter kategori proyek"
        className="mt-8 flex flex-wrap items-center gap-2.5"
      >
        {tabs.map(([catKey, label]) => {
          const isSelected = activeFilter === catKey;
          return (
            <button
              key={catKey}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveFilter(catKey)}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra ${
                isSelected
                  ? "border border-chakra bg-chakra/20 text-sand shadow-[0_0_18px_rgba(255,106,43,0.3)]"
                  : "border border-dune/20 text-ash hover:border-dune/50 hover:text-sand"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <motion.ul
        layout
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => {
            const isFeatured = !!project.featured;
            const isExpanded = expandedId === project.id;
            const currentDesc = project.desc[locale] || project.desc.en;
            const currentDetails = project.details?.[locale] || project.details?.en;

            return (
              <motion.li
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`flex flex-col ${
                  isFeatured ? "sm:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                <TiltCard className="flex h-full flex-col p-5 md:p-6">
                  {/* Abstract SVG Artwork */}
                  <div className="relative mb-4">
                    <ProjectArtwork
                      id={project.id}
                      cat={project.cat}
                      title={project.title}
                    />

                    {/* Featured Mission Badge */}
                    {isFeatured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-chakra/60 bg-night/85 px-3 py-1 font-mono text-xs font-semibold text-chakra shadow-lg backdrop-blur-md">
                        <Sparkles className="h-3 w-3 text-chakra" />
                        {t.projects.featured}
                      </span>
                    )}

                    {/* Category Label */}
                    <span className="absolute right-3 top-3 rounded-full border border-dune/25 bg-night/80 px-2.5 py-0.5 font-mono text-[11px] text-dune backdrop-blur-sm uppercase">
                      {project.kind}
                    </span>
                  </div>

                  {/* Title and Stats Row */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-bold tracking-tight text-sand group-hover:text-chakra transition-colors md:text-2xl">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-ash/80">
                      {typeof project.stars === "number" && project.stars > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-dune fill-dune/30" />
                          {project.stars}
                        </span>
                      )}
                      {typeof project.forks === "number" && project.forks > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <GitFork className="h-3.5 w-3.5 text-ash" />
                          {project.forks}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">
                    {currentDesc}
                  </p>

                  {/* Expandable Details Section */}
                  {currentDetails && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => toggleExpand(project.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-dune hover:text-chakra transition-colors focus-visible:outline-none"
                      >
                        {isExpanded ? (
                          <>
                            <span>{t.projects.detailsClose}</span>
                            <ChevronUp className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            <span>{t.projects.detailsOpen}</span>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 rounded-lg border border-dune/15 bg-night/50 p-3 text-xs leading-relaxed text-sand/90"
                        >
                          {currentDetails}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Tech Stack Badges */}
                  {project.tech && project.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-dune/20 bg-dune/10 px-2.5 py-0.5 font-mono text-[11px] text-dune/90"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action CTA Buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-dune/15 pt-4">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-dune/30 px-3.5 py-1.5 text-xs font-medium text-sand transition hover:border-chakra hover:bg-chakra/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
                    >
                      <Github className="h-3.5 w-3.5 text-dune" />
                      {t.projects.viewRepo}
                    </a>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-chakra/20 border border-chakra/60 px-3.5 py-1.5 text-xs font-semibold text-sand transition hover:bg-chakra hover:text-night shadow-[0_0_12px_rgba(255,106,43,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t.projects.viewLive}
                      </a>
                    )}
                  </div>
                </TiltCard>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
