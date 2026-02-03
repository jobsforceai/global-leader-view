import { DashboardShell } from "@/components/layout";
import { getAuthTokenValue } from "@/actions/_core";
import { getKpis } from "@/actions/bi";
import { KpiData } from "@/lib/types";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let kpiData: KpiData[] | undefined;
  const token = await getAuthTokenValue();

  if (token) {
    try {
      const data = await getKpis();
      kpiData = [
        {
          id: "global-business-volume",
          value: data.globalBusinessVolume.value ?? 0,
          trend: 0,
          trendDirection: "neutral",
        },
        {
          id: "active-leader-count",
          value: data.activeLeaderCount.value ?? 0,
          trend: 0,
          trendDirection: "neutral",
        },
        {
          id: "reinvestment-ratio",
          value: data.reinvestmentRatio.value ?? 0,
          trend: 0,
          trendDirection: "neutral",
        },
        {
          id: "leader-retention",
          value: data.leaderRetention.value ?? 0,
          trend: 0,
          trendDirection: "neutral",
        },
        {
          id: "cities-added",
          value: data.citiesAdded.value ?? 0,
          trend: 0,
          trendDirection: "neutral",
        },
        {
          id: "countries-added",
          value: data.countriesAdded.value ?? 0,
          trend: 0,
          trendDirection: "neutral",
        },
        {
          id: "revenue-per-leader",
          value: data.revenuePerLeader.value ?? 0,
          trend: 0,
          trendDirection: "neutral",
        },
      ];
    } catch {
      kpiData = undefined;
    }
  }

  return <DashboardShell kpiData={kpiData}>{children}</DashboardShell>;
}
