import { getPortfolioSection } from "../portfolio-data";
import { SectionPage } from "../section-page";

export default function AboutPage() {
  return <SectionPage section={getPortfolioSection("about")} />;
}
