import { getVolumeTrends } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { VolumeTrendsCard } from "../VolumeTrendsCard";

export async function CeoVolumeTrendsSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const [daily, weekly, monthly] = await Promise.all([
      getVolumeTrends("daily", startDate, endDate),
      getVolumeTrends("weekly", startDate, endDate),
      getVolumeTrends("monthly", startDate, endDate),
    ]);

    return <VolumeTrendsCard daily={daily} weekly={weekly} monthly={monthly} />;
  } catch {
    return <VolumeTrendsCard daily={[]} weekly={[]} monthly={[]} />;
  }
}
