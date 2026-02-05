import { getInvestors } from "@/actions/investors";
import { InvestorsSearch } from "@/app/(app)/shared/InvestorsSearch";

export async function InvestorsSection() {
  try {
    const investors = await getInvestors({ limit: 100 });
    return <InvestorsSearch initialInvestors={investors} />;
  } catch {
    return <InvestorsSearch initialInvestors={[]} />;
  }
}
