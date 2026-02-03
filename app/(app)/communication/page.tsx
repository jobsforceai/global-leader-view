import { CommunicationPageClient } from "./_components/CommunicationPageClient";
import {
  getCommunicationHealth,
  getFollowups,
  getWeeklyBoardData,
  getWeeklySummary,
} from "@/actions/communication";
import { getCalls, getWeeklyCallsMetrics } from "@/actions/calls";
import { getAuthTokenValue } from "@/actions/_core";

export default async function CommunicationPage() {
  const token = await getAuthTokenValue();
  if (!token) {
    return (
      <CommunicationPageClient
        metrics={{
          contactedLast7Days: 0,
          contactedLast14Days: 0,
          contactedLast30Days: 0,
          avgDaysSinceContact: 0,
          overdueFollowups: 0,
          totalLeaders: 0,
        }}
        notContacted={[]}
        highVolumeLowContact={[]}
        weeklyCalls={[]}
        weeklyCallsMetrics={{
          attendancePercent: 0,
          lastWeekAttendancePercent: 0,
          noShowCount: 0,
          missedConsecutiveCount: 0,
        }}
        followups={[]}
        weeklyBoard={[]}
        weeklyBoardWeekStart={new Date().toISOString()}
        weeklySummary={null}
      />
    );
  }

  const [
    communication7,
    communication14,
    communication30,
    followups,
    weeklyBoardData,
    weeklySummary,
  ] = await Promise.all([
    getCommunicationHealth(7),
    getCommunicationHealth(14),
    getCommunicationHealth(30),
    getFollowups(),
    getWeeklyBoardData(),
    getWeeklySummary(),
  ]);

  const [weeklyCalls, weeklyCallsMetrics] = await Promise.all([
    getCalls(),
    getWeeklyCallsMetrics(),
  ]);

  const metrics = {
    contactedLast7Days: communication7.summary.contactedLast7Days,
    contactedLast14Days: communication14.summary.contactedLast14Days,
    contactedLast30Days: communication30.summary.contactedLast30Days,
    avgDaysSinceContact: communication14.summary.avgDaysSinceContact,
    overdueFollowups: followups.filter((f) => f.status === "overdue").length,
    totalLeaders: communication14.summary.totalLeaders,
  };

  return (
    <CommunicationPageClient
      metrics={metrics}
      notContacted={communication14.notContacted}
      highVolumeLowContact={communication14.highVolumeLowContact}
      weeklyCalls={weeklyCalls}
      weeklyCallsMetrics={weeklyCallsMetrics}
      followups={followups}
      weeklyBoard={weeklyBoardData.leaders}
      weeklyBoardWeekStart={weeklyBoardData.weekStart}
      weeklySummary={weeklySummary}
    />
  );
}
