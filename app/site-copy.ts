export type SignalId = "knowledge" | "research" | "work" | "about";

export const homeCopy: {
  name: string;
  role: string;
  signals: Array<{
    id: SignalId;
    index: string;
    label: string;
    side: "left" | "right";
  }>;
} = {
  name: "PETROS KOUTROULIS",
  role: "RESEARCH ASSOCIATE",
  signals: [
    {
      id: "knowledge",
      index: "01",
      label: "Knowledge",
      side: "right",
    },
    {
      id: "research",
      index: "02",
      label: "Credentials",
      side: "left",
    },
    {
      id: "work",
      index: "03",
      label: "Work",
      side: "right",
    },
    {
      id: "about",
      index: "04",
      label: "About",
      side: "right",
    },
  ],
};
