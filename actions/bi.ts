"use server";

import { apiFetch } from "./_core";
import {
  VolumeDataPoint,
  LeaderSnapshot,
  MarketIntervention,
  TopLeader,
  BiLeaderScorecard,
  HighGrowthLeader,
  WeakMarket,
  TopRegion,
} from "@/lib/types";

interface VolumeTrendsResponse {
  trends: Array<{ label: string; value: number }>;
}

interface TopLeadersResponse {
  leaders: Array<{
    userId: string;
    fullName: string;
    country: string;
    region?: string;
    city?: string;
    businessVolume: number;
    volumeType?: "SELF" | "TEAM";
    growthPercent?: number;
  }>;
}

interface StagnatingLeadersResponse {
  leaders: Array<{
    userId: string;
    fullName?: string;
    country?: string;
    region?: string;
    city?: string;
    currentValue: number;
    previousValue: number;
    growthPercent: number;
  }>;
}

interface MarketsNeedingInterventionResponse {
  markets: Array<{
    market: { country: string; region?: string; city?: string };
    currentVolume: number;
    previousVolume: number;
    changePercent: number;
    reason: string;
  }>;
}

interface KpisResponse {
  globalBusinessVolume: { value: number | null };
  activeLeaderCount: { value: number | null };
  reinvestmentRatio: { value: number | null };
  leaderRetention: { value: number | null };
  citiesAdded: { value: number | null };
  countriesAdded: { value: number | null };
  revenuePerLeader: { value: number | null };
  lastUpdatedAt: string;
}

interface LeaderScorecardsResponse {
  scorecards: Array<{
    userId: string;
    fullName: string;
    country: string;
    region: string;
    city: string;
    businessVolume: number;
    reinvestmentRate: number | null;
    retentionRate: number | null;
    growthPercent: number;
    consistencyIndicator: "consistent" | "volatile" | "improving" | "declining" | null;
    teamSize: number;
    volumeTrend: Array<{ date: string; value: number }>;
    status: "ACTIVE" | "INACTIVE" | "AT_RISK";
    lastContactDays: number | null;
    lastContactAt?: string | null;
    lastActivityAt?: string | null;
    legStrength?: {
      threshold: number;
      strong: Array<{ userId: string; volume: number }>;
      weak: Array<{ userId: string; volume: number }>;
    } | null;
  }>;
}

interface HighGrowthLeadersResponse {
  leaders: Array<{
    userId: string;
    fullName: string;
    country: string;
    region: string;
    city: string;
    currentValue: number;
    previousValue: number;
    growthPercent: number;
  }>;
}

interface WeakMarketsResponse {
  markets: Array<{
    market: { country: string; region?: string; city?: string };
    currentVolume: number;
    previousVolume: number;
    changePercent: number;
  }>;
}

interface TopRegionsResponse {
  regions: Array<{
    market: { country: string; region?: string; city?: string };
    currentVolume: number;
    previousVolume: number;
    growthPercent: number;
  }>;
}

interface DailyClosureResponse {
  leadsGenerated: number;
  newIds: number;
  capitalCollected: number;
  closers: string[];
  presentationsDone: number | null;
  conversionRate: number | null;
  revenuePerDay: number | null;
}

function marketToString(market: { country: string; region?: string; city?: string }) {
  const parts = [market.country, market.region, market.city].filter(Boolean);
  return parts.join(" - ");
}

function severityFromChange(changePercent: number): "low" | "medium" | "high" {
  const abs = Math.abs(changePercent);
  if (abs >= 30) return "high";
  if (abs >= 15) return "medium";
  return "low";
}

export async function getVolumeTrends(
  granularity: "daily" | "weekly" | "monthly",
  startDate?: string,
  endDate?: string
): Promise<VolumeDataPoint[]> {
  const params = new URLSearchParams({ granularity });
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const data = await apiFetch<VolumeTrendsResponse>(
    `/globalview/bi/volume-trends?${params.toString()}`
  );

  return data.trends.map((t) => ({ date: t.label, value: t.value }));
}

export async function getTopLeaders(
  startDate?: string,
  endDate?: string,
  mode: "self" | "team" = "self"
): Promise<LeaderSnapshot[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  params.set("mode", mode);

  const data = await apiFetch<TopLeadersResponse>(
    `/globalview/bi/top-leaders?${params.toString()}`
  );

  return data.leaders.map((leader) => ({
    id: leader.userId,
    name: leader.fullName,
    country: leader.country,
    city: leader.city,
    businessVolume: leader.businessVolume,
    growthPercent: leader.growthPercent ?? 0,
  }));
}

export async function getStagnatingLeaders(
  startDate?: string,
  endDate?: string
): Promise<LeaderSnapshot[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const data = await apiFetch<StagnatingLeadersResponse>(
    `/globalview/bi/stagnating-leaders?${params.toString()}`
  );

  return data.leaders.map((leader) => ({
    id: leader.userId,
    name: leader.fullName || leader.userId,
    country: leader.country,
    city: leader.city,
    growthPercent: leader.growthPercent,
    reasonTag: "Negative Growth",
  }));
}

export async function getMarketsNeedingIntervention(
  startDate?: string,
  endDate?: string
): Promise<MarketIntervention[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const data = await apiFetch<MarketsNeedingInterventionResponse>(
    `/globalview/bi/markets-needing-intervention?${params.toString()}`
  );

  return data.markets.map((market, index) => ({
    id: `${index}`,
    market: marketToString(market.market),
    severity: severityFromChange(market.changePercent),
    reason: market.reason,
    changePercent: market.changePercent,
    status: "open",
  }));
}

export async function getKpis(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  return apiFetch<KpisResponse>(`/globalview/bi/kpis?${params.toString()}`);
}

export async function getLeaderScorecards(
  startDate?: string,
  endDate?: string
): Promise<BiLeaderScorecard[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const data = await apiFetch<LeaderScorecardsResponse>(
    `/globalview/bi/leader-scorecards?${params.toString()}`
  );

  return data.scorecards.map((leader) => ({
    id: leader.userId,
    name: leader.fullName,
    country: leader.country,
    region: leader.region,
    city: leader.city,
    market: [leader.country, leader.region, leader.city].filter(Boolean).join(" - "),
    businessVolume: leader.businessVolume,
    reinvestmentRate: leader.reinvestmentRate,
    retentionRate: leader.retentionRate,
    growthPercent: leader.growthPercent,
    consistencyIndicator: leader.consistencyIndicator,
    teamSize: leader.teamSize,
    status:
      leader.status === "AT_RISK"
        ? "at-risk"
        : leader.status === "INACTIVE"
        ? "inactive"
        : "active",
    lastContactDays: leader.lastContactDays,
    lastContactAt: leader.lastContactAt || null,
    lastActivityAt: leader.lastActivityAt || null,
    volumeTrend: leader.volumeTrend.map((v) => ({
      date: v.date,
      value: v.value,
    })),
    legStrength: leader.legStrength || null,
  }));
}

export async function getHighGrowthLeaders(
  startDate?: string,
  endDate?: string
): Promise<HighGrowthLeader[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const data = await apiFetch<HighGrowthLeadersResponse>(
    `/globalview/bi/high-growth-leaders?${params.toString()}`
  );

  return data.leaders.map((leader) => ({
    id: leader.userId,
    name: leader.fullName,
    market: [leader.country, leader.region, leader.city]
      .filter(Boolean)
      .join(" - "),
    growthPercent: leader.growthPercent,
    currentValue: leader.currentValue,
    previousValue: leader.previousValue,
  }));
}

export async function getWeakMarkets(
  startDate?: string,
  endDate?: string
): Promise<WeakMarket[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const data = await apiFetch<WeakMarketsResponse>(
    `/globalview/bi/weak-markets?${params.toString()}`
  );

  return data.markets.map((market, index) => ({
    id: `${index}`,
    market: marketToString(market.market),
    country: market.market.country,
    city: market.market.city,
    businessVolume: market.currentVolume,
    volumeTrend: market.changePercent > 0 ? "up" : market.changePercent < 0 ? "down" : "flat",
    volumeChange: market.changePercent,
    primaryRiskReason: "Volume Decline",
    severity: severityFromChange(market.changePercent),
    riskTags: [],
  }));
}

export async function getTopRegions(
  startDate?: string,
  endDate?: string
): Promise<TopRegion[]> {
  const params = new URLSearchParams();
  params.set("level", "city");
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const data = await apiFetch<TopRegionsResponse>(
    `/globalview/bi/top-regions?${params.toString()}`
  );

  return data.regions.map((region, index) => ({
    id: `${index}`,
    name: marketToString(region.market),
    businessVolume: region.currentVolume,
    growthPercent: region.growthPercent,
  }));
}

export async function getTopPerformers(
  startDate?: string,
  endDate?: string,
  mode: "self" | "team" = "self"
): Promise<TopLeader[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  params.set("mode", mode);

  const data = await apiFetch<TopLeadersResponse>(
    `/globalview/bi/top-leaders?${params.toString()}`
  );

  return data.leaders.map((leader) => ({
    id: leader.userId,
    name: leader.fullName,
    market: [leader.country, leader.region, leader.city]
      .filter(Boolean)
      .join(" - "),
    businessVolume: leader.businessVolume,
    growthPercent: leader.growthPercent ?? 0,
  }));
}

export async function getDailyClosure(
  date: string
): Promise<import("@/lib/types").DailyClosureTracker> {
  const data = await apiFetch<DailyClosureResponse>(
    `/globalview/bi/daily-closure?date=${date}`
  );

  return {
    date,
    leadsGenerated: data.leadsGenerated,
    newIds: data.newIds,
    capitalCollected: data.capitalCollected,
    closers: data.closers,
    presentationsDone: data.presentationsDone,
    conversionRate: data.conversionRate,
    revenuePerDay: data.revenuePerDay,
  };
}
