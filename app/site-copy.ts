export type SignalId = "knowledge" | "research" | "work" | "about";

export const homeCopy: {
  name: string;
  signals: Array<{
    id: SignalId;
    index: string;
    label: string;
    icon: string;
    side: "left" | "right";
  }>;
} = {
  name: "Petros Koutroulis",
  signals: [
    {
      id: "knowledge",
      index: "01",
      label: "Knowledge",
      icon: "◇",
      side: "right",
    },
    {
      id: "research",
      index: "02",
      label: "Credentials",
      icon: "✓",
      side: "left",
    },
    {
      id: "work",
      index: "03",
      label: "Work",
      icon: "↗",
      side: "right",
    },
    {
      id: "about",
      index: "04",
      label: "About",
      icon: "○",
      side: "right",
    },
  ],
};
