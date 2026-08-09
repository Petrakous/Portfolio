export type SignalId = "knowledge" | "research" | "work" | "about";

export const homeCopy: {
  name: string;
  role: string;
  signals: Array<{
    id: SignalId;
    index: string;
    label: string;
    title: string;
    body: string;
    href?: string;
    action?: string;
  }>;
} = {
  name: "PETROS KOUTROULIS",
  role: "RESEARCH ASSOCIATE",
  signals: [
    {
      id: "knowledge",
      index: "01",
      label: "Knowledge",
      title: "Technical practice",
      body: "Computer vision, research tooling, data pipelines, and real-time 3D for the web.",
    },
    {
      id: "research",
      index: "02",
      label: "Research",
      title: "Research workflows",
      body: "Human-in-the-loop systems for dataset curation, visual QA, annotation, and reproducible media processing.",
    },
    {
      id: "work",
      index: "03",
      label: "Work",
      title: "Selected work",
      body: "3DHUA, Aerial Detection Atlas, and TRIFFID Review Studio.",
      href: "/work",
      action: "Open work index",
    },
    {
      id: "about",
      index: "04",
      label: "About",
      title: "Based in Athens",
      body: "Research Associate and Informatics & Telematics student working between research and product-minded engineering.",
    },
  ],
};
