import { getVolumeTrends } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { CommandCenterVolumeCard } from "../CommandCenterVolumeCard";

export async function CommandCenterVolumeSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const [daily, weekly, monthly] = await Promise.all([
      getVolumeTrends("daily", startDate, endDate),
      getVolumeTrends("weekly", startDate, endDate),
      getVolumeTrends("monthly", startDate, endDate),
    ]);

    return (
      <CommandCenterVolumeCard daily={daily} weekly={weekly} monthly={monthly} />
    );
  } catch {
    return (
      <CommandCenterVolumeCard daily={[]} weekly={[]} monthly={[]} />
    );
  }
}
