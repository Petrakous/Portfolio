import { getPortfolioSection } from "../portfolio-data";
import { SectionPage } from "../section-page";

export default function KnowledgePage() {
  return <SectionPage section={getPortfolioSection("knowledge")} />;
}
