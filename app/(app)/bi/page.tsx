import { BusinessIntelligenceClient } from "./_components/BusinessIntelligenceClient";
import {
  getHighGrowthLeaders,
  getLeaderScorecards,
  getDailyClosure,
  getTopPerformers,
  getTopRegions,
  getVolumeTrends,
  getWeakMarkets,
} from "@/actions/bi";
import { getCommunicationHealth, getFollowups } from "@/actions/communication";
import { getDateRange } from "@/lib/date";
import { getAuthTokenValue } from "@/actions/_core";

export default async function BusinessIntelligencePage() {
  const token = await getAuthTokenValue();
  if (!token) {
    return (
      <BusinessIntelligenceClient
        volumeDaily={[]}
        volumeWeekly={[]}
        volumeMonthly={[]}
        topRegions={[]}
        topPerformers={[]}
        communicationMetrics={{
          contactedLast7Days: 0,
          contactedLast14Days: 0,
          contactedLast30Days: 0,
          overdueFollowups: 0,
          totalLeaders: 0,
        }}
        weakAlerts={[]}
        leaderScorecards={[]}
        highGrowthLeaders={[]}
        weakMarkets={[]}
        dailyClosure={null}
      />
    );
  }

  const { startDate, endDate } = getDateRange(30);

  const [volumeDaily, volumeWeekly, volumeMonthly] = await Promise.all([
    getVolumeTrends("daily", startDate, endDate),
    getVolumeTrends("weekly", startDate, endDate),
    getVolumeTrends("monthly", startDate, endDate),
  ]);

  const [
    topRegions,
    topPerformers,
    leaderScorecards,
    highGrowthLeaders,
    weakMarkets,
    dailyClosure,
    communication7,
    communication14,
    communication30,
    followups,
  ] = await Promise.all([
    getTopRegions(startDate, endDate),
    getTopPerformers(startDate, endDate),
    getLeaderScorecards(startDate, endDate),
    getHighGrowthLeaders(startDate, endDate),
    getWeakMarkets(startDate, endDate),
    getDailyClosure(new Date().toISOString().slice(0, 10)),
    getCommunicationHealth(7),
    getCommunicationHealth(14),
    getCommunicationHealth(30),
    getFollowups(),
  ]);

  const communicationMetrics = {
    contactedLast7Days: communication7.summary.contactedLast7Days,
    contactedLast14Days: communication14.summary.contactedLast14Days,
    contactedLast30Days: communication30.summary.contactedLast30Days,
    overdueFollowups: followups.filter((f) => f.status === "overdue").length,
    totalLeaders: communication14.summary.totalLeaders,
  };

  const weakAlerts = weakMarkets.filter((m) => m.severity !== "low").slice(0, 4);

  return (
    <BusinessIntelligenceClient
      volumeDaily={volumeDaily}
      volumeWeekly={volumeWeekly}
      volumeMonthly={volumeMonthly}
      topRegions={topRegions}
      topPerformers={topPerformers}
      communicationMetrics={communicationMetrics}
    weakAlerts={weakAlerts}
    leaderScorecards={leaderScorecards}
    highGrowthLeaders={highGrowthLeaders}
    weakMarkets={weakMarkets}
    dailyClosure={dailyClosure}
  />
  );
}
