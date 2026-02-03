"use server";

import { apiFetch } from "./_core";
import { GrowthEvent, GrowthEventKpiSnapshot } from "@/lib/types";

interface GrowthEventsResponse {
  events: Array<{
    eventId: string;
    type: "CITY_LAUNCH" | "COUNTRY_EXPANSION" | "LEADERSHIP_PROMOTION" | "CAMPAIGN";
    name: string;
    country?: string;
    region?: string;
    city?: string;
    marketType?: "CITY" | "COUNTRY";
    leaderOwnerUserId?: string;
    internalOwnerGvUserId?: string;
    startDate: string;
    endDate?: string;
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
    objective?: string;
    targetKpis?: Record<string, number>;
    actualKpis?: Record<string, number>;
    notes?: string;
  }>;
}

function mapType(type: GrowthEventsResponse["events"][number]["type"]): GrowthEvent["type"] {
  switch (type) {
    case "CITY_LAUNCH":
      return "City Launch";
    case "COUNTRY_EXPANSION":
      return "Country Expansion";
    case "LEADERSHIP_PROMOTION":
      return "Leadership Promotion";
    default:
      return "Special Growth Campaign";
  }
}

function mapStatus(
  status: GrowthEventsResponse["events"][number]["status"]
): GrowthEvent["status"] {
  switch (status) {
    case "PLANNED":
      return "Planned";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    default:
      return "On Hold";
  }
}

function buildMarket(event: GrowthEventsResponse["events"][number]) {
  const parts = [event.country, event.region, event.city].filter(Boolean);
  return parts.join(" - ");
}

function mapKpiSnapshot(actualKpis?: Record<string, number>): GrowthEventKpiSnapshot {
  return {
    volume: actualKpis?.volume ?? 0,
    volumeChange: 0,
    leaderActivations: actualKpis?.activations ?? 0,
    activationsChange: 0,
    retention: actualKpis?.retention ?? 0,
    retentionChange: 0,
  };
}

export async function getGrowthEvents(): Promise<GrowthEvent[]> {
  const data = await apiFetch<GrowthEventsResponse>(
    "/globalview/growth/events"
  );

  return data.events.map((event) => ({
    id: event.eventId,
    name: event.name,
    type: mapType(event.type),
    market: buildMarket(event),
    marketType: event.marketType === "CITY" ? "City" : "Country",
    owner: event.internalOwnerGvUserId || event.leaderOwnerUserId || "-",
    startDate: event.startDate,
    endDate: event.endDate || null,
    status: mapStatus(event.status),
    objective: event.objective || "",
    targetKpis: event.targetKpis
      ? Object.entries(event.targetKpis).map(([key, value]) => `${key}: ${value}`)
      : [],
    kpiSnapshot: mapKpiSnapshot(event.actualKpis),
    notes: event.notes || "",
  }));
}
