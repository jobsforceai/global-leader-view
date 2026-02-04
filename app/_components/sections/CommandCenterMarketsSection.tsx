import { getMarketsNeedingIntervention } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { MarketsInterventionTable } from "@/components/tables";

export async function CommandCenterMarketsSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const marketInterventions = await getMarketsNeedingIntervention(
      startDate,
      endDate
    );

    return <MarketsInterventionTable alerts={marketInterventions} />;
  } catch {
    return <MarketsInterventionTable alerts={[]} />;
  }
}
