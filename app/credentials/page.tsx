import { getPortfolioSection } from "../portfolio-data";
import { SectionPage } from "../section-page";

export default function CredentialsPage() {
  return <SectionPage section={getPortfolioSection("research")} />;
}
