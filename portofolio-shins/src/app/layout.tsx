import { Metadata } from "next";
import { Shippori_Mincho, Inter } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageContext";
import { site } from "@/lib/data";
import "./globals.css";

const shippori = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-shippori",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const description =
  "Full Stack Developer dan Data Science Enthusiast dari Yogyakarta, Indonesia. Building Scalable Digital Products and Transforming Data into Intelligent Solutions.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Full Stack Developer & Data Scientist`,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    "Full Stack Developer",
    "Data Analyst",
    "Data Science",
    "Machine Learning",
    "React",
    "Next.js",
    "Laravel",
    "Python",
    "Yogyakarta",
    "Indonesia",
    "Ahmad Tibyan Hakim",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Full Stack Developer & Data Scientist`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Portfolio`,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: site.email,
  jobTitle: "Full Stack Developer & Data Science Enthusiast",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yogyakarta",
    addressRegion: "D.I. Yogyakarta",
    addressCountry: "ID",
  },
  sameAs: [site.github],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${shippori.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
