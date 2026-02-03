"use server";

import { apiFetch } from "./_core";
import { CampaignListItem, CampaignImpact, CampaignStatus } from "@/lib/types";

interface CampaignsResponse {
  campaigns: Array<{
    campaignId: string;
    name: string;
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    country?: string;
    region?: string;
    city?: string;
    marketType?: string;
    startDate?: string;
    endDate?: string;
    objective?: string;
  }>;
}

interface CampaignImpactResponse {
  campaign: {
    campaignId: string;
    name: string;
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    country?: string;
    region?: string;
    city?: string;
    marketType?: string;
    startDate?: string;
    endDate?: string;
    objective?: string;
  };
  impact: {
    baseline: number;
    during: number;
    post: number;
    changePercent: number;
    baselineWindow: { start: string; end: string };
    campaignWindow: { start: string; end: string };
    postWindow: { start: string; end: string };
  };
  trend: Array<{ date: string; metrics: { volume: number } }>;
}

function mapStatus(status: CampaignsResponse["campaigns"][number]["status"]): CampaignStatus {
  switch (status) {
    case "PLANNED":
      return "Planned";
    case "IN_PROGRESS":
      return "Active";
    case "COMPLETED":
      return "Completed";
    default:
      return "Cancelled";
  }
}

function buildMarket(campaign: CampaignsResponse["campaigns"][number]) {
  const parts = [campaign.country, campaign.region, campaign.city].filter(Boolean);
  return parts.join(" - ") || campaign.marketType || "Global";
}

function computeDuration(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return "-";
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "-";
  const days = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  return `${days} days`;
}

export async function getCampaigns(): Promise<CampaignListItem[]> {
  const data = await apiFetch<CampaignsResponse>("/globalview/campaigns");

  return data.campaigns.map((campaign) => ({
    id: campaign.campaignId,
    name: campaign.name,
    market: buildMarket(campaign),
    startDate: campaign.startDate || "",
    endDate: campaign.endDate || "",
    duration: computeDuration(campaign.startDate, campaign.endDate),
    primaryObjective: campaign.objective || "",
    status: mapStatus(campaign.status),
  }));
}

export async function getCampaignImpact(campaignId: string): Promise<CampaignImpact> {
  const data = await apiFetch<CampaignImpactResponse>(
    `/globalview/campaigns/${campaignId}/impact`
  );

  const market = buildMarket({
    campaignId: data.campaign.campaignId,
    name: data.campaign.name,
    status: data.campaign.status,
    country: data.campaign.country,
    region: data.campaign.region,
    city: data.campaign.city,
    marketType: data.campaign.marketType,
    startDate: data.campaign.startDate,
    endDate: data.campaign.endDate,
    objective: data.campaign.objective,
  });

  return {
    id: data.campaign.campaignId,
    name: data.campaign.name,
    market,
    startDate: data.campaign.startDate || "",
    endDate: data.campaign.endDate || "",
    duration: computeDuration(data.campaign.startDate, data.campaign.endDate),
    primaryObjective: data.campaign.objective || "",
    status: mapStatus(data.campaign.status),
    baseline: data.impact.baseline,
    during: data.impact.during,
    post: data.impact.post,
    changePercent: data.impact.changePercent,
    trend: data.trend,
  };
}
