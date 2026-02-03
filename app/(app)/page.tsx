import { CommandCenterClient } from "@/app/_components/CommandCenterClient";
import {
  getMarketsNeedingIntervention,
  getTopLeaders,
  getVolumeTrends,
} from "@/actions/bi";
import { getCommunicationHealth, getFollowups } from "@/actions/communication";
import { getWeeklyCallsMetrics } from "@/actions/calls";
import { getDateRange } from "@/lib/date";
import { getAuthTokenValue } from "@/actions/_core";

export default async function CommandCenterPage() {
  const token = await getAuthTokenValue();
  if (!token) {
    return (
      <CommandCenterClient
        volumeDaily={[]}
        volumeWeekly={[]}
        volumeMonthly={[]}
        topLeaders={[]}
        teamTopLeaders={[]}
        marketInterventions={[]}
        communicationMetrics={{
          contactedLast7Days: 0,
          contactedLast14Days: 0,
          contactedLast30Days: 0,
          overdueFollowups: 0,
          totalLeaders: 0,
        }}
        weeklyCallsMetrics={{
          attendancePercent: 0,
          lastWeekAttendancePercent: 0,
          noShowCount: 0,
          missedConsecutiveCount: 0,
        }}
      />
    );
  }

  const { startDate, endDate } = getDateRange(30);

  const [volumeDaily, volumeWeekly, volumeMonthly] = await Promise.all([
    getVolumeTrends("daily", startDate, endDate),
    getVolumeTrends("weekly", startDate, endDate),
    getVolumeTrends("monthly", startDate, endDate),
  ]);

  const [topLeaders, teamTopLeaders, marketInterventions] = await Promise.all([
    getTopLeaders(startDate, endDate, "self"),
    getTopLeaders(startDate, endDate, "team"),
    getMarketsNeedingIntervention(startDate, endDate),
  ]);

  const [communication7, communication14, communication30, followups] =
    await Promise.all([
      getCommunicationHealth(7),
      getCommunicationHealth(14),
      getCommunicationHealth(30),
      getFollowups(),
    ]);

  const overdueFollowups = followups.filter((f) => f.status === "overdue").length;

  const communicationMetrics = {
    contactedLast7Days: communication7.summary.contactedLast7Days,
    contactedLast14Days: communication14.summary.contactedLast14Days,
    contactedLast30Days: communication30.summary.contactedLast30Days,
    overdueFollowups,
    totalLeaders: communication14.summary.totalLeaders,
    avgDaysSinceContact: communication14.summary.avgDaysSinceContact,
  };

  const weeklyCallsMetrics = await getWeeklyCallsMetrics();

  console.log("[CommandCenter] volumeDaily:", volumeDaily.length);
  console.log("[CommandCenter] volumeWeekly:", volumeWeekly.length);
  console.log("[CommandCenter] volumeMonthly:", volumeMonthly.length);
  console.log("[CommandCenter] topLeaders:", topLeaders.length);
  console.log("[CommandCenter] teamTopLeaders:", teamTopLeaders.length);
  console.log(
    "[CommandCenter] marketInterventions:",
    marketInterventions.length
  );
  console.log("[CommandCenter] communicationMetrics:", communicationMetrics);
  console.log("[CommandCenter] weeklyCallsMetrics:", weeklyCallsMetrics);

  return (
    <CommandCenterClient
      volumeDaily={volumeDaily}
      volumeWeekly={volumeWeekly}
      volumeMonthly={volumeMonthly}
      topLeaders={topLeaders}
      teamTopLeaders={teamTopLeaders}
      marketInterventions={marketInterventions}
      communicationMetrics={communicationMetrics}
      weeklyCallsMetrics={weeklyCallsMetrics}
    />
  );
}
