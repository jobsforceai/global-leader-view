import { getHighGrowthLeaders } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { HighGrowthLeaders } from "../index";

export async function HighGrowthLeadersSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const leaders = await getHighGrowthLeaders(startDate, endDate);
    return <HighGrowthLeaders leaders={leaders} />;
  } catch {
    return <HighGrowthLeaders leaders={[]} />;
  }
}
