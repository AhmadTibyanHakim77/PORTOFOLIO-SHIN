export interface ProjectItem {
  id: string;
  title: string;
  cat: "web" | "ai" | "data";
  kind: string;
  tech: string[];
  desc: {
    id: string;
    en: string;
  };
  details?: {
    id: string;
    en: string;
  };
  repo: string;
  repoName: string;
  featured?: boolean;
  liveUrl?: string | null;
  stars?: number;
  forks?: number;
  language?: string | null;
  topics?: string[];
}

export const site = {
  name: "Ahmad Tibyan Hakim",
  email: "ahmadtibyanhakim09@gmail.com",
  github: "https://github.com/AhmadTibyanHakim77",
  location: "Yogyakarta, Indonesia",
  url: "https://ahmadtibyanhakim.vercel.app",
  // Optional handles left undefined until real URLs exist
  linkedin: undefined as string | undefined,
  whatsapp: undefined as string | undefined,
};

export type Cat = "web" | "ai" | "data";

const g = (repo: string) => `${site.github}/${repo}`;

export const projects: ProjectItem[] = [
  {
    id: "studymate-ai",
    title: "StudyMate-AI",
    cat: "ai",
    kind: "AI Study Assistant",
    tech: ["TypeScript", "Next.js", "AI Integration", "Tailwind CSS"],
    desc: {
      id: "Platform asisten belajar cerdas berbasis AI untuk merangkum materi, menghasilkan kuis adaptif, dan memandu pemahaman konsep secara interaktif.",
      en: "Intelligent AI-powered study companion designed for adaptive learning, automated curriculum summarization, and interactive tutoring.",
    },
    details: {
      id: "Mengintegrasikan prompt engineering terstruktur dengan arsitektur frontend modern untuk menyajikan alur belajar yang personal dan responsif.",
      en: "Integrates structured prompt pipelines with a modern frontend architecture to deliver personalized and low-latency learning workflows.",
    },
    repo: g("StudyMate-AI"),
    repoName: "StudyMate-AI",
    featured: true,
  },
  {
    id: "careerly",
    title: "Careerly AI Career Platform",
    cat: "ai",
    kind: "AI Career Platform",
    tech: ["TypeScript", "Next.js", "AI Career Engine", "Tailwind CSS"],
    desc: {
      id: "Platform navigasi karier cerdas dengan analisis kesenjangan keterampilan, rekomendasi jalur karir terarah, dan optimalisasi profil profesional.",
      en: "Smart career navigation system featuring skills gap analysis, contextual career pathway recommendations, and resume profile enhancements.",
    },
    details: {
      id: "Dirancang untuk membantu talenta memetakan potensi dan menyiapkan portofolio relevan sesuai kebutuhan industri teknologi masa kini.",
      en: "Engineered to assist developers and tech aspirants in diagnosing career gaps and navigating technical hiring landscapes.",
    },
    repo: g("careerly-ai-career-platform"),
    repoName: "careerly-ai-career-platform",
    featured: true,
    liveUrl: "https://careerly-ai-career-platform.vercel.app",
  },
  {
    id: "tetra-coffee",
    title: "Tetra Coffee",
    cat: "web",
    kind: "Coffee Shop & Ordering Platform",
    tech: ["Next.js", "Laravel", "TypeScript", "Tailwind CSS"],
    desc: {
      id: "Website kedai kopi modern dengan arsitektur monolit terpisah (Next.js frontend + Laravel API backend) untuk manajemen katalog menu dan reservasi.",
      en: "Modern artisanal coffee shop platform featuring a decoupled architecture (Next.js frontend with Laravel API backend) for menu management and bookings.",
    },
    details: {
      id: "Mengusung performa Core Web Vitals tinggi, desain antarmuka imersif bernuansa estetik, serta endpoint API yang terproteksi.",
      en: "Boasts high Core Web Vitals scores, aesthetic dark-mode UI, and secure RESTful endpoints for real-time inventory and orders.",
    },
    repo: g("tetra-coffee"),
    repoName: "tetra-coffee",
    featured: true,
    liveUrl: "https://tetra-coffee-iota.vercel.app",
  },
  {
    id: "adult-income-prediction",
    title: "Adult Income Prediction",
    cat: "ai",
    kind: "Machine Learning / Predictive Modeling",
    tech: ["Python", "Scikit-learn", "Pandas", "Feature Engineering"],
    desc: {
      id: "Proyek machine learning menyeluruh untuk memprediksi tingkat pendapatan individu (di atas atau di bawah $50K) berdasarkan data demografis sensus.",
      en: "End-to-end predictive machine learning model to estimate individual income thresholds based on multi-variate demographic census metrics.",
    },
    details: {
      id: "Mencakup exploratory data analysis (EDA), imputasi data hilang, encoding variabel kategorikal, dan evaluasi performa model klasifikasi.",
      en: "Covers rigorous exploratory data analysis, missing-value imputation, feature scaling, encoding, and balanced classification evaluation.",
    },
    repo: g("adult-income-prediction"),
    repoName: "adult-income-prediction",
    featured: true,
  },
  {
    id: "antrein",
    title: "Antrein",
    cat: "web",
    kind: "Queue Management System",
    tech: ["TypeScript", "Next.js", "Tailwind CSS"],
    desc: {
      id: "Sistem manajemen antrean digital untuk mempermudah pendaftaran, pemantauan nomor urut secara real-time, dan efisiensi alur loket.",
      en: "Digital queue orchestration web platform for ticketing, real-time ticket tracking, and streamlining customer dispatch workflows.",
    },
    repo: g("Antrein"),
    repoName: "Antrein",
    featured: false,
  },
  {
    id: "tunas-tabung",
    title: "Tunas-Tabung",
    cat: "web",
    kind: "Financial Savings Management",
    tech: ["Laravel", "Blade", "PHP", "MySQL"],
    desc: {
      id: "Aplikasi pencatatan tabungan dan arus kas berbasis Laravel dengan autentikasi berjenjang dan laporan mutasi saldo terstruktur.",
      en: "Structured savings and cashflow record application powered by Laravel with role-based access control and financial reporting.",
    },
    repo: g("Tunas-Tabung"),
    repoName: "Tunas-Tabung",
    featured: false,
  },
  {
    id: "obat-tani",
    title: "Obat Tani",
    cat: "web",
    kind: "Agricultural Catalog & Commerce",
    tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
    desc: {
      id: "Website katalog dan informasi produk sarana pertanian untuk membantu petani menemukan formulasi obat tanaman dan nutrisi yang tepat.",
      en: "Agricultural information and supply catalog system guiding local farmers toward appropriate crop treatments and fertilizers.",
    },
    repo: g("obat-tani"),
    repoName: "obat-tani",
    featured: false,
    liveUrl: "https://obat-tani-ujio.vercel.app/",
  },
  {
    id: "adidas-store",
    title: "Adidas Store",
    cat: "web",
    kind: "E-Commerce Concept",
    tech: ["Python", "Flask/Django", "Web Engineering"],
    desc: {
      id: "Implementasi antarmuka e-commerce produk apparel dan sepatu atletik modern dengan navigasi katalog produk interaktif.",
      en: "Interactive athletic footwear and apparel e-commerce store experience highlighting responsive product showcase and shopping flow.",
    },
    repo: g("adidas-store"),
    repoName: "adidas-store",
    featured: false,
    liveUrl: "https://adidas-store-nine.vercel.app",
  },
  {
    id: "bakery",
    title: "Bakery",
    cat: "web",
    kind: "Artisan Bakery Showcase",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    desc: {
      id: "Website etalase digital untuk bakery premium dengan presentasi produk visual berkualitas tinggi dan rincian varian menu kue.",
      en: "Digital storefront for an artisanal bakery featuring responsive pastry showcases and detailed dietary menu indexes.",
    },
    repo: g("bakery"),
    repoName: "bakery",
    featured: false,
    liveUrl: "https://bakery-five-taupe.vercel.app",
  },
  {
    id: "projek-dimas-baby-shop",
    title: "Projek Dimas Baby Shop",
    cat: "web",
    kind: "Baby Apparel & Essentials Shop",
    tech: ["Laravel", "Blade", "PHP", "MySQL"],
    desc: {
      id: "Platform katalog dan penjualan kebutuhan perlengkapan bayi dengan kemudahan pencarian kategori produk dan manajemen stok barang.",
      en: "E-commerce platform for baby products and maternity essentials equipped with categorized browsing and inventory tracking.",
    },
    repo: g("projek-dimas-baby-shop"),
    repoName: "projek-dimas-baby-shop",
    featured: false,
  },
  {
    id: "stock-market-analysis",
    title: "Stock Market Analysis",
    cat: "data",
    kind: "Financial Market Analytics",
    tech: ["Python", "Pandas", "Matplotlib", "Jupyter Notebook"],
    desc: {
      id: "Eksplorasi historis harga saham dengan indikator teknikal (Moving Averages, Volatilitas, RSI) untuk mendeteksi tren pasar finansial.",
      en: "Quantitative stock price time-series exploration utilizing moving averages, volatility modeling, and technical trend momentum indicators.",
    },
    repo: g("stock-market-analysis"),
    repoName: "stock-market-analysis",
    featured: false,
  },
  {
    id: "gold-price-forecasting",
    title: "Gold Price Forecasting",
    cat: "data",
    kind: "Time Series Predictive Analysis",
    tech: ["Python", "Jupyter Notebook", "Time Series", "Pandas"],
    desc: {
      id: "Analisis peramalan pergerakan harga emas menggunakan teknik dekomposisi deret waktu untuk mengidentifikasi pola musiman dan tren jangka panjang.",
      en: "Time series decomposition and forecasting models applied to historical gold commodity fluctuations for cyclical and trend detection.",
    },
    repo: g("gold-price-forecasting"),
    repoName: "gold-price-forecasting",
    featured: false,
  },
];

export interface StackCategory {
  title: {
    id: string;
    en: string;
  };
  iconName: string;
  items: string[];
}

export const stackCategories: StackCategory[] = [
  {
    title: { id: "Bahasa Pemrograman", en: "Programming Languages" },
    iconName: "Code2",
    items: ["TypeScript", "JavaScript", "Python", "PHP", "Java", "C++"],
  },
  {
    title: { id: "Frontend Engineering", en: "Frontend Engineering" },
    iconName: "Layout",
    items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Vite", "Framer Motion"],
  },
  {
    title: { id: "Backend & Arsitektur API", en: "Backend & API Architecture" },
    iconName: "Server",
    items: ["Laravel", "Node.js", "Express.js", "RESTful APIs", "JWT Auth"],
  },
  {
    title: { id: "Database & Penyimpanan", en: "Database & Storage" },
    iconName: "Database",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Database Indexing", "Query Optimization"],
  },
  {
    title: { id: "Analisis Data & Visualisasi", en: "Data Analytics & Visualization" },
    iconName: "BarChart3",
    items: ["SQL", "Excel", "Tableau", "Google Colab", "Jupyter Notebook", "EDA"],
  },
  {
    title: { id: "Data Science & Manipulasi", en: "Data Science & Wrangling" },
    iconName: "Binary",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Feature Engineering"],
  },
  {
    title: { id: "Machine Learning Klasik", en: "Machine Learning Algorithms" },
    iconName: "Cpu",
    items: ["Scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP"],
  },
  {
    title: { id: "Deep Learning & AI", en: "Deep Learning & AI Systems" },
    iconName: "BrainCircuit",
    items: ["TensorFlow", "Keras", "CNN", "RNN", "LSTM", "NLP", "Transformers", "Hugging Face"],
  },
  {
    title: { id: "Alat & Ekosistem DevOps", en: "Dev Tools & Infrastructure" },
    iconName: "Wrench",
    items: ["Git", "GitHub", "VS Code", "Docker", "Postman", "Linux", "Vercel"],
  },
];
