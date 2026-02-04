import { getWeeklyCallsMetrics } from "@/actions/calls";
import { WeeklyCallsCard } from "@/components/cards";

export async function CommandCenterWeeklyCallsSection() {
  try {
    const weeklyCallsMetrics = await getWeeklyCallsMetrics();
    return <WeeklyCallsCard metrics={weeklyCallsMetrics} />;
  } catch {
    return (
      <WeeklyCallsCard
        metrics={{
          attendancePercent: 0,
          lastWeekAttendancePercent: 0,
          noShowCount: 0,
          missedConsecutiveCount: 0,
        }}
      />
    );
  }
}
