"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { type GitHubUserProfile } from "@/lib/github";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { Github, FolderGit2, Users, MapPin, ExternalLink, Code } from "lucide-react";

interface GitHubSectionProps {
  profile: GitHubUserProfile;
}

export default function GitHubSection({ profile }: GitHubSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="github" className="mx-auto w-[92%] max-w-5xl scroll-mt-20 py-24 md:py-32">
      <Reveal>
        <p className="mb-3 font-display font-semibold tracking-wider text-chakra uppercase">
          {t.github.chapter}
        </p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-sand sm:text-4xl md:text-5xl">
          {t.github.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ash md:text-lg">
          {t.github.subtitle}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-5">
        {/* Profile Card */}
        <div className="md:col-span-2">
          <Reveal delay={0.1}>
            <TiltCard className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-chakra/60 shadow-[0_0_20px_rgba(255,106,43,0.3)]">
                    {/* Fallback avatar with initial if image doesn't load */}
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-chakra to-ember font-display text-2xl font-bold text-night">
                      ATH
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-sand">
                      {profile.name}
                    </h3>
                    <p className="font-mono text-xs text-chakra">
                      @{profile.login}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-ash">
                      <MapPin className="h-3.5 w-3.5 text-dune" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-dune/15 py-4">
                  <div className="flex items-center gap-2.5">
                    <FolderGit2 className="h-5 w-5 text-chakra" />
                    <div>
                      <p className="text-xl font-bold font-mono text-sand">
                        {profile.publicRepos}
                      </p>
                      <p className="text-[11px] text-ash">
                        {t.github.publicRepos}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="h-5 w-5 text-dune" />
                    <div>
                      <p className="text-xl font-bold font-mono text-sand">
                        {profile.followers}
                      </p>
                      <p className="text-[11px] text-ash">
                        {t.github.followers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={profile.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-chakra/20 border border-chakra/60 py-2.5 text-xs font-semibold text-sand transition hover:bg-chakra hover:text-night shadow-[0_0_15px_rgba(255,106,43,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
                >
                  <Github className="h-4 w-4" />
                  <span>{t.github.viewProfile}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </TiltCard>
          </Reveal>
        </div>

        {/* Top Languages Breakdown */}
        <div className="md:col-span-3">
          <Reveal delay={0.2}>
            <TiltCard className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-dune" />
                  <h3 className="font-display text-lg font-bold text-sand">
                    {t.github.topLanguages}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-ash">
                  Distribusi bahasa utama yang terdeteksi dari seluruh repositori publik.
                </p>

                <div className="mt-6 space-y-4">
                  {profile.topLanguages.map((lang) => (
                    <div key={lang.language}>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-sand">{lang.language}</span>
                        <span className="text-dune font-semibold">
                          {lang.percentage}% ({lang.count} repos)
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-night/80 border border-dune/20">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-ember via-chakra to-dune transition-all duration-700"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dune/15">
                <a
                  href={`${profile.htmlUrl}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-dune hover:text-chakra transition-colors underline underline-offset-4"
                >
                  <span>{t.github.cta}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

