import { getInvestors } from "@/actions/investors";
import { InvestorsSearch } from "@/app/(app)/shared/InvestorsSearch";

export async function InvestorsSection() {
  try {
    const investors = await getInvestors({ limit: 50 });
    return <InvestorsSearch initialInvestors={investors} />;
  } catch {
    return <InvestorsSearch initialInvestors={[]} />;
  }
}
