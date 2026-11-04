export type Locale = "id" | "en";

export interface Dictionary {
  nav: {
    prolog: string;
    path: string;
    expertise: string;
    jutsu: string;
    missions: string;
    training: string;
    github: string;
    contact: string;
    langToggle: string;
    skipLink: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    mark: string;
    greeting: string;
    titleFirst: string;
    titleLast: string;
    headline: string;
    role: string;
    ctaPrimary: string;
    ctaSecondary: string;
    sandHint: string;
    statusBadge: string;
  };
  about: {
    chapter: string;
    title: string;
    lead: string;
    pillars: {
      title: string;
      desc: string;
    }[];
  };
  expertise: {
    chapter: string;
    title: string;
    subtitle: string;
    items: {
      id: string;
      title: string;
      desc: string;
      tags: string[];
    }[];
  };
  stack: {
    chapter: string;
    title: string;
    subtitle: string;
  };
  projects: {
    chapter: string;
    title: string;
    subtitle: string;
    all: string;
    web: string;
    ai: string;
    data: string;
    viewRepo: string;
    viewLive: string;
    featured: string;
    detailsOpen: string;
    detailsClose: string;
    allReposCta: string;
    stars: string;
    forks: string;
  };
  github: {
    chapter: string;
    title: string;
    subtitle: string;
    profile: string;
    publicRepos: string;
    followers: string;
    topLanguages: string;
    cta: string;
    viewProfile: string;
  };
  training: {
    chapter: string;
    title: string;
    subtitle: string;
    steps: {
      num: string;
      title: string;
      desc: string;
    }[];
  };
  contact: {
    chapter: string;
    title: string;
    subtitle: string;
    sendEmail: string;
    copyEmail: string;
    copied: string;
    location: string;
  };
  footer: {
    quote: string;
    rights: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  id: {
    nav: {
      prolog: "Prolog",
      path: "Jalan",
      expertise: "Keahlian",
      jutsu: "Jurus",
      missions: "Misi",
      training: "Latihan",
      github: "GitHub",
      contact: "Kontak",
      langToggle: "EN",
      skipLink: "Lewati ke konten utama",
      menuOpen: "Buka menu navigasi",
      menuClose: "Tutup menu navigasi",
    },
    hero: {
      mark: "砂",
      greeting: "SAND SHINOBI · CODING SANCTUARY",
      titleFirst: "Ahmad Tibyan",
      titleLast: "Hakim",
      headline: "Building Scalable Digital Products and Transforming Data into Intelligent Solutions.",
      role: "Full Stack Developer · Data Analyst & Data Science Enthusiast",
      ctaPrimary: "Lihat Misi Saya",
      ctaSecondary: "Hubungi Saya",
      sandHint: "Gerakkan kursor untuk mengendalikan pusaran pasir. Klik untuk melepaskan chakra.",
      statusBadge: "Tersedia untuk Peluang & Kolaborasi",
    },
    about: {
      chapter: "Bab I",
      title: "Jalan Sang Pembangun",
      lead: "Berpijak di Yogyakarta, menempuh disiplin ganda: merajut arsitektur aplikasi web modern yang kokoh dan menggali kebijaksanaan dari samudra data.",
      pillars: [
        {
          title: "Full Stack Development",
          desc: "Membangun sistem perangkat lunak terpadu end-to-end, dari antarmuka interaktif yang presisi hingga backend tangguh yang siap melayani beban tinggi.",
        },
        {
          title: "Data Analytics",
          desc: "Mengekstraksi pola tersembunyi dari dataset kompleks, menyusun visualisasi intuitif, dan mengubah data mentah menjadi keputusan strategis.",
        },
        {
          title: "Data Science & AI",
          desc: "Merancang model prediktif, eksplorasi Machine Learning terapan, dan arsitektur AI yang memecahkan masalah dunia nyata secara cerdas.",
        },
      ],
    },
    expertise: {
      chapter: "Bab II",
      title: "Spesialisasi & Kapabilitas",
      subtitle: "Enam ranah inti kompetensi teknis yang terus diasah melalui proyek nyata.",
      items: [
        {
          id: "fullstack",
          title: "Full Stack Web Development",
          desc: "Pengembangan web menyeluruh dengan ekosistem modern: TypeScript, Next.js, React, Laravel, dan Node.js dengan arsitektur bersih dan terstruktur.",
          tags: ["Next.js", "React", "TypeScript", "Laravel", "Node.js"],
        },
        {
          id: "responsive-ui",
          title: "Responsive UI Engineering",
          desc: "Menciptakan antarmuka pengguna yang adaptif di berbagai resolusi layar, berkinerja tinggi, dan memperhatikan aksesibilitas (a11y) sesuai standar.",
          tags: ["Tailwind CSS", "CSS3", "Framer Motion", "Design Systems", "A11y"],
        },
        {
          id: "database",
          title: "Database Design & Architecture",
          desc: "Pemodelan skema relasional dan non-relasional, normalisasi data, optimasi kueri kompleks, serta integritas data relasional.",
          tags: ["PostgreSQL", "MySQL", "MongoDB", "Database Normalization", "Query Tuning"],
        },
        {
          id: "api",
          title: "RESTful API Development & Integration",
          desc: "Membangun endpoint API yang efisien, aman, terdokumentasi rapi, serta integrasi mulus dengan layanan pihak ketiga dan microservices.",
          tags: ["REST APIs", "Express.js", "Laravel API", "Postman", "JWT & Auth"],
        },
        {
          id: "frontend-arch",
          title: "Modern Frontend Architecture",
          desc: "Manajemen state yang terprediksi, Server-Side Rendering (SSR), Static Generation (SSG), pemisahan komponen modular, dan optimalisasi Core Web Vitals.",
          tags: ["SSR/SSG", "Component Architecture", "Performance", "State Management"],
        },
        {
          id: "data-ml",
          title: "Data Analytics & Machine Learning",
          desc: "Pengolahan dataset besar, pemodelan statistik, Feature Engineering, hingga pelatihan algoritma machine learning prediktif dan evaluasi metrik akurasi.",
          tags: ["Python", "Pandas", "Scikit-learn", "XGBoost", "Data Modeling", "EDA"],
        },
      ],
    },
    stack: {
      chapter: "Bab III",
      title: "Jurus & Senjata",
      subtitle: "Teknologi dan perkakas yang dikuasai untuk menempa solusi digital.",
    },
    projects: {
      chapter: "Bab IV",
      title: "Misi yang Telah Diselesaikan",
      subtitle: "Portofolio proyek terpilih yang mencakup pengembangan web, kecerdasan buatan, dan analitik data.",
      all: "Semua Misi",
      web: "Web Development",
      ai: "AI & Machine Learning",
      data: "Data Analytics",
      viewRepo: "Lihat Repositori",
      viewLive: "Demo Langsung",
      featured: "Misi Unggulan",
      detailsOpen: "Detail Misi",
      detailsClose: "Tutup",
      allReposCta: "Jelajahi semua repositori di GitHub",
      stars: "bintang",
      forks: "fork",
    },
    github: {
      chapter: "Statistik Pasir",
      title: "Aktivitas Kode Terbuka",
      subtitle: "Transparansi jejak kontribusi langsung dari GitHub API.",
      profile: "Profil GitHub",
      publicRepos: "Repositori Publik",
      followers: "Pengikut",
      topLanguages: "Bahasa Dominan",
      cta: "Kunjungi GitHub @AhmadTibyanHakim77",
      viewProfile: "Buka Profil",
    },
    training: {
      chapter: "Bab V",
      title: "Latihan & Siklus Rekayasa",
      subtitle: "Metodologi terstruktur dari konsep hingga implementasi yang andal.",
      steps: [
        {
          num: "01",
          title: "Discover & Analisis Masalah",
          desc: "Memahami akar permasalahan bisnis, kebutuhan pengguna, dan mendefinisikan batasan serta metrik keberhasilan.",
        },
        {
          num: "02",
          title: "Research & Eksplorasi Data",
          desc: "Mengevaluasi tumpukan teknologi, kelayakan arsitektur sistem, dan mengeksplorasi struktur data yang diperlukan.",
        },
        {
          num: "03",
          title: "Design & Pemodelan Sistem",
          desc: "Merancang skema database, antarmuka pengguna intuitif, dan kontrak API sebelum baris kode pertama ditulis.",
        },
        {
          num: "04",
          title: "Develop & Implementasi Bersih",
          desc: "Menulis kode yang mudah dirawat (clean code), modular, serta menerapkan pola desain teruji di frontend maupun backend.",
        },
        {
          num: "05",
          title: "Test & Optimasi Kinerja",
          desc: "Pengujian fungsional lintas perangkat, penanganan edge-case, dan profiling kecepatan untuk respon instan.",
        },
        {
          num: "06",
          title: "Deploy & Pemantauan Berkelanjutan",
          desc: "Deployment otomatis, konfigurasi environment produksi yang aman, dan monitoring kesehatan aplikasi secara proaktif.",
        },
      ],
    },
    contact: {
      chapter: "Bab VI",
      title: "Punya Ide? Mari Kita Wujudkan.",
      subtitle: "Terbuka untuk diskusi proyek rekayasa perangkat lunak, eksplorasi data, maupun peluang karir.",
      sendEmail: "Kirim Email Langsung",
      copyEmail: "Salin Alamat Email",
      copied: "Alamat Email Tersalin!",
      location: "Yogyakarta, D.I. Yogyakarta, Indonesia",
    },
    footer: {
      quote: "Menempa kode laksana memadatkan butir pasir menjadi benteng yang kokoh.",
      rights: "Hak Cipta Dilindungi.",
    },
  },
  en: {
    nav: {
      prolog: "Prologue",
      path: "Path",
      expertise: "Expertise",
      jutsu: "Arsenal",
      missions: "Missions",
      training: "Process",
      github: "GitHub",
      contact: "Contact",
      langToggle: "ID",
      skipLink: "Skip to main content",
      menuOpen: "Open navigation menu",
      menuClose: "Close navigation menu",
    },
    hero: {
      mark: "砂",
      greeting: "SAND SHINOBI · CODING SANCTUARY",
      titleFirst: "Ahmad Tibyan",
      titleLast: "Hakim",
      headline: "Building Scalable Digital Products and Transforming Data into Intelligent Solutions.",
      role: "Full Stack Developer · Data Analyst & Data Science Enthusiast",
      ctaPrimary: "Explore My Missions",
      ctaSecondary: "Get in Touch",
      sandHint: "Move cursor to command the sand vortex. Click to release chakra burst.",
      statusBadge: "Available for Opportunities & Collaboration",
    },
    about: {
      chapter: "Chapter I",
      title: "The Builder's Path",
      lead: "Rooted in Yogyakarta, walking a dual discipline: crafting resilient modern web architectures and mining actionable intelligence from oceans of data.",
      pillars: [
        {
          title: "Full Stack Development",
          desc: "Building cohesive end-to-end software systems, from pixel-perfect responsive interfaces to robust backends engineered for scale.",
        },
        {
          title: "Data Analytics",
          desc: "Extracting meaningful patterns from complex datasets, crafting intuitive visualizations, and transforming raw information into strategic foresight.",
        },
        {
          title: "Data Science & AI",
          desc: "Designing predictive models, experimenting with applied machine learning, and delivering intelligent solutions for real-world challenges.",
        },
      ],
    },
    expertise: {
      chapter: "Chapter II",
      title: "Specializations & Capabilities",
      subtitle: "Six core pillars of technical competency honed through hands-on production builds.",
      items: [
        {
          id: "fullstack",
          title: "Full Stack Web Development",
          desc: "End-to-end web engineering across modern stacks: TypeScript, Next.js, React, Laravel, and Node.js with clean, maintainable architecture.",
          tags: ["Next.js", "React", "TypeScript", "Laravel", "Node.js"],
        },
        {
          id: "responsive-ui",
          title: "Responsive UI Engineering",
          desc: "Creating fluid, highly accessible user interfaces across all breakpoints, strictly upholding accessibility standards (a11y) and silky smooth 60fps motion.",
          tags: ["Tailwind CSS", "CSS3", "Framer Motion", "Design Systems", "A11y"],
        },
        {
          id: "database",
          title: "Database Design & Architecture",
          desc: "Designing relational and document database schemas, normalizing data models, query tuning, and ensuring transactional data integrity.",
          tags: ["PostgreSQL", "MySQL", "MongoDB", "Database Normalization", "Query Tuning"],
        },
        {
          id: "api",
          title: "RESTful API Development & Integration",
          desc: "Developing secure, performant, and well-documented RESTful endpoints, with seamless third-party API and service integrations.",
          tags: ["REST APIs", "Express.js", "Laravel API", "Postman", "JWT & Auth"],
        },
        {
          id: "frontend-arch",
          title: "Modern Frontend Architecture",
          desc: "Implementing predictable state machines, SSR/SSG rendering strategies, reusable component hierarchies, and optimizing Core Web Vitals.",
          tags: ["SSR/SSG", "Component Architecture", "Performance", "State Management"],
        },
        {
          id: "data-ml",
          title: "Data Analytics & Machine Learning",
          desc: "Data wrangling, statistical exploratory data analysis, feature engineering, and training supervised learning algorithms with rigorous validation.",
          tags: ["Python", "Pandas", "Scikit-learn", "XGBoost", "Data Modeling", "EDA"],
        },
      ],
    },
    stack: {
      chapter: "Chapter III",
      title: "Jutsu & Arsenal",
      subtitle: "Technologies and battle-tested tools deployed to forge resilient digital products.",
    },
    projects: {
      chapter: "Chapter IV",
      title: "Missions Accomplished",
      subtitle: "A curated index of production builds across full-stack web, artificial intelligence, and data analytics.",
      all: "All Missions",
      web: "Web Development",
      ai: "AI & Machine Learning",
      data: "Data Analytics",
      viewRepo: "View Repository",
      viewLive: "Live Demo",
      featured: "Featured Mission",
      detailsOpen: "Mission Details",
      detailsClose: "Close",
      allReposCta: "Explore all repositories on GitHub",
      stars: "stars",
      forks: "forks",
    },
    github: {
      chapter: "Sand Registry",
      title: "Open Source Activity",
      subtitle: "Real-time contribution statistics powered by the official GitHub API.",
      profile: "GitHub Profile",
      publicRepos: "Public Repositories",
      followers: "Followers",
      topLanguages: "Top Languages",
      cta: "Visit GitHub @AhmadTibyanHakim77",
      viewProfile: "Open Profile",
    },
    training: {
      chapter: "Chapter V",
      title: "Training & Engineering Lifecycle",
      subtitle: "A disciplined, step-by-step methodology ensuring precision from idea to production.",
      steps: [
        {
          num: "01",
          title: "Discover & Problem Definition",
          desc: "Deconstruct business objectives, understand end-user friction points, and define precise success criteria.",
        },
        {
          num: "02",
          title: "Research & Technical Evaluation",
          desc: "Benchmark architectural patterns, evaluate library ecosystems, and audit data schemas for feasibility.",
        },
        {
          num: "03",
          title: "Design & Architecture",
          desc: "Architect database schemas, craft ergonomic interface systems, and draft clean API contracts before coding.",
        },
        {
          num: "04",
          title: "Develop & Clean Implementation",
          desc: "Write modular, self-documenting code with comprehensive typing and battle-tested engineering patterns.",
        },
        {
          num: "05",
          title: "Test & Performance Tuning",
          desc: "Conduct cross-browser audits, stress-test responsive breakpoints, and optimize bundle sizes for instant load.",
        },
        {
          num: "06",
          title: "Deploy & Observability",
          desc: "Ship to production with automated pipelines, hardened environment configurations, and active monitoring.",
        },
      ],
    },
    contact: {
      chapter: "Chapter VI",
      title: "Have an Idea? Let's Build It.",
      subtitle: "Always open to discussing software engineering projects, data-driven initiatives, or full-time opportunities.",
      sendEmail: "Send Direct Email",
      copyEmail: "Copy Email Address",
      copied: "Email Address Copied!",
      location: "Yogyakarta, Special Region of Yogyakarta, Indonesia",
    },
    footer: {
      quote: "Forging code like compacting grains of sand into an unyielding bastion.",
      rights: "All Rights Reserved.",
    },
  },
};

