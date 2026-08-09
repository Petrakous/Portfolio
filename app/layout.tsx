import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "Petros Koutroulis — Research Tooling, 3D Systems & Software",
    description:
      "The interactive portfolio of Petros Koutroulis (Petrakous): computer vision, research data tooling, 3D web systems, and research software.",
    keywords: ["Petros Koutroulis", "Petrakous", "computer vision", "research tooling", "3D web", "Gaussian splatting", "software engineering"],
    authors: [{ name: "Petros Koutroulis", url: "https://github.com/Petrakous" }],
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      type: "website",
      url: origin,
      title: "Petros Koutroulis — Personal Research Lab",
      description: "Tools and interactive systems for complex data, research workflows, and digital environments.",
      siteName: "Petrakous / Personal Research Lab",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Petros Koutroulis — Personal Research Lab" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Petros Koutroulis — Personal Research Lab",
      description: "Research tooling, computer vision, spatial computing, and research software.",
      images: [`${origin}/og.png`],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070707",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Petros Koutroulis",
    alternateName: "Petrakous",
    url: "https://github.com/Petrakous",
    sameAs: ["https://github.com/Petrakous", "https://www.linkedin.com/in/petrakous"],
    jobTitle: "Research Associate",
    affiliation: { "@type": "CollegeOrUniversity", name: "Harokopio University of Athens" },
    knowsAbout: ["Computer Vision", "Research Data Tooling", "3D Web", "Gaussian Splatting", "Software Engineering"],
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ imports: { three: "/avatar/vendor/three.module.js" } }),
          }}
        />
      </body>
    </html>
  );
}
