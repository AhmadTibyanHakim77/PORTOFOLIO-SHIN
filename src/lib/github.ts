import { projects as fallbackProjects, ProjectItem, site } from "./data";

export interface GitHubUserProfile {
  login: string;
  name: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  location: string;
  topLanguages: { language: string; count: number; percentage: number }[];
}

interface RawGitHubRepo {
  name: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
}

export async function getGitHubProfile(): Promise<GitHubUserProfile> {
  const fallback: GitHubUserProfile = {
    login: "AhmadTibyanHakim77",
    name: site.name,
    avatarUrl: "https://avatars.githubusercontent.com/u/277319576?v=4",
    htmlUrl: site.github,
    publicRepos: 14,
    followers: 2,
    location: site.location,
    topLanguages: [
      { language: "TypeScript", count: 6, percentage: 43 },
      { language: "Python", count: 4, percentage: 29 },
      { language: "PHP / Blade", count: 3, percentage: 21 },
      { language: "HTML / CSS", count: 1, percentage: 7 },
    ],
  };

  try {
    const userRes = await fetch("https://api.github.com/users/AhmadTibyanHakim77", {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AhmadTibyanHakim-Portfolio",
      },
    });

    if (!userRes.ok) {
      return fallback;
    }

    const userData = await userRes.json();

    const reposRes = await fetch("https://api.github.com/users/AhmadTibyanHakim77/repos?per_page=100", {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AhmadTibyanHakim-Portfolio",
      },
    });

    let topLanguages = fallback.topLanguages;

    if (reposRes.ok) {
      const reposData: RawGitHubRepo[] = await reposRes.json();
      const counts: Record<string, number> = {};
      let total = 0;

      for (const r of reposData) {
        if (r.language) {
          counts[r.language] = (counts[r.language] || 0) + 1;
          total++;
        }
      }

      if (total > 0) {
        topLanguages = Object.entries(counts)
          .map(([lang, count]) => ({
            language: lang,
            count,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }
    }

    return {
      login: userData.login || fallback.login,
      name: userData.name || fallback.name,
      avatarUrl: userData.avatar_url || fallback.avatarUrl,
      htmlUrl: userData.html_url || fallback.htmlUrl,
      publicRepos: typeof userData.public_repos === "number" ? userData.public_repos : fallback.publicRepos,
      followers: typeof userData.followers === "number" ? userData.followers : fallback.followers,
      location: userData.location || fallback.location,
      topLanguages,
    };
  } catch (_err) {
    return fallback;
  }
}

export async function getEnrichedProjects(): Promise<ProjectItem[]> {
  try {
    const reposRes = await fetch("https://api.github.com/users/AhmadTibyanHakim77/repos?per_page=100", {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AhmadTibyanHakim-Portfolio",
      },
    });

    if (!reposRes.ok) {
      return fallbackProjects;
    }

    const repos: RawGitHubRepo[] = await reposRes.json();
    const repoMap = new Map<string, RawGitHubRepo>();
    for (const r of repos) {
      repoMap.set(r.name.toLowerCase(), r);
    }

    return fallbackProjects.map((p) => {
      const match = repoMap.get(p.repoName.toLowerCase());
      if (!match) return p;

      // Extract real live homepage if present and not empty
      const liveUrl = match.homepage && match.homepage.trim().startsWith("http")
        ? match.homepage.trim()
        : p.liveUrl || null;

      // Real stats
      const stars = typeof match.stargazers_count === "number" ? match.stargazers_count : p.stars;
      const forks = typeof match.forks_count === "number" ? match.forks_count : p.forks;
      const language = match.language || p.language;
      const topics = match.topics && match.topics.length > 0 ? match.topics : p.topics;

      // Enhance description if GitHub has one
      const desc = { ...p.desc };
      if (match.description && match.description.trim()) {
        desc.en = match.description.trim();
      }

      return {
        ...p,
        liveUrl,
        stars,
        forks,
        language,
        topics,
        desc,
      };
    });
  } catch (_err) {
    return fallbackProjects;
  }
}

