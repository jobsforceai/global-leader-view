import { getInvestors } from "@/actions/investors";
import { InvestorsSearch } from "@/app/(app)/shared/InvestorsSearch";

export async function CommunicationInvestorsSection() {
  try {
    const investors = await getInvestors({ limit: 50 });
    return <InvestorsSearch title="Investors (Weekly Calls)" initialInvestors={investors} />;
  } catch {
    return <InvestorsSearch title="Investors (Weekly Calls)" initialInvestors={[]} />;
  }
}
