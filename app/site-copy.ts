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
    side: "left" | "right";
    details: string[];
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
      side: "right",
      details: ["Computer vision", "3D web systems", "Research software"],
    },
    {
      id: "research",
      index: "02",
      label: "Research",
      title: "Research workflows",
      body: "Human-in-the-loop systems for dataset curation, visual QA, annotation, and reproducible media processing.",
      side: "left",
      details: ["TRIFFID research", "Dataset curation", "Visual quality assurance"],
    },
    {
      id: "work",
      index: "03",
      label: "Work",
      title: "Selected work",
      body: "3DHUA, Aerial Detection Atlas, and TRIFFID Review Studio.",
      side: "right",
      details: ["Interactive 3D", "Model comparison", "Research operations"],
      href: "/work",
      action: "Open work index",
    },
    {
      id: "about",
      index: "04",
      label: "About",
      title: "Based in Athens",
      body: "Research Associate and Informatics & Telematics student working between research and product-minded engineering.",
      side: "right",
      details: ["Harokopio University", "Athens, Greece", "Research + development"],
    },
  ],
};
