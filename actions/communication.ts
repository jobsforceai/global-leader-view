"use server";

import { apiFetch } from "./_core";
import {
  FollowUp,
  LeaderContact,
  CommunicationMetrics,
  WeeklyBoardLeader,
  WeeklyBoardSummary,
  WeeklyBoardData,
} from "@/lib/types";

interface CommunicationHealthResponse {
  summary: {
    totalLeaders: number;
    contactedWithinDays: number;
    contactedPercentage: number;
    notContactedCount: number;
    cutoffDate: string;
  };
  notContacted: Array<{
    userId: string;
    fullName: string;
    roleType: string;
    preferredChannel: string;
    market: { country: string; region?: string; city?: string };
    lastContactAt: string | null;
    daysSinceLastContact: number | null;
    businessVolume: number;
  }>;
  highVolumeLowContact: Array<{
    userId: string;
    fullName: string;
    roleType: string;
    preferredChannel: string;
    market: { country: string; region?: string; city?: string };
    lastContactAt: string | null;
    daysSinceLastContact: number | null;
    businessVolume: number;
  }>;
}

interface FollowupsResponse {
  followUps: Array<{
    followUpId: string;
    leaderUserId: string;
    leaderName: string;
    title: string;
    ownerGvUserId: string;
    ownerName?: string;
    status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "RESOLVED" | "IGNORED";
    dueDate: string;
    source?: "CALL" | "MANUAL" | "ALERT";
  }>;
}

interface WeeklyBoardResponse {
  weekStart: string;
  weekEnd: string;
  leaders: Array<{
    leaderUserId: string;
    fullName: string;
    phone?: string | null;
    market: { country: string; region?: string; city?: string };
    weekStart: string;
    weekEnd: string;
    status: "NOT_CONTACTED" | "CONTACTED" | "NEED_FOLLOWUP" | "COMPLETED";
    statusNotes?: string | null;
    followUp?: {
      id: string;
      dueDate: string;
      status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "RESOLVED" | "IGNORED";
      notes?: string | null;
    } | null;
  }>;
}

interface WeeklySummaryResponse {
  weekStart: string;
  weekEnd: string;
  totalLeaders: number;
  contacted: number;
  followUps: number;
  statusCounts: {
    NOT_CONTACTED: number;
    CONTACTED: number;
    NEED_FOLLOWUP: number;
    COMPLETED: number;
  };
}

function marketToString(market: { country: string; region?: string; city?: string }) {
  const parts = [market.country, market.region, market.city].filter(Boolean);
  return parts.join(" - ");
}

function normalizeRole(roleType: string | null | undefined) {
  if (!roleType) return "Unknown";
  return roleType
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeChannel(channel: string | null | undefined) {
  if (!channel) return "Unknown";
  const upper = channel.toUpperCase();
  if (upper === "WHATSAPP") return "WhatsApp";
  if (upper === "TELEGRAM") return "Telegram";
  if (upper === "PHONE") return "Phone";
  if (upper === "EMAIL") return "Email";
  if (upper === "ZOOM") return "Zoom";
  return channel;
}

function normalizeFollowupStatus(
  status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "RESOLVED" | "IGNORED",
  dueDate: string
): "open" | "overdue" | "completed" {
  if (status === "RESOLVED" || status === "IGNORED") return "completed";
  const due = new Date(dueDate).getTime();
  if (Number.isFinite(due) && due < Date.now()) return "overdue";
  return "open";
}

function normalizeFollowupSource(
  source?: "CALL" | "MANUAL" | "ALERT"
): "call" | "manual" | "alert" {
  if (source === "CALL") return "call";
  if (source === "ALERT") return "alert";
  return "manual";
}

export async function getCommunicationHealth(days = 14) {
  const data = await apiFetch<CommunicationHealthResponse>(
    `/globalview/communication/health?days=${days}`
  );

  const notContacted: LeaderContact[] = data.notContacted.map((leader) => ({
    id: leader.userId,
    name: leader.fullName,
    role: normalizeRole(leader.roleType),
    market: marketToString(leader.market),
    country: leader.market.country,
    city: leader.market.city,
    daysSinceLastContact: leader.daysSinceLastContact,
    preferredChannel: normalizeChannel(leader.preferredChannel),
    businessVolume: leader.businessVolume,
    lastContactDate: leader.lastContactAt,
  }));

  const highVolumeLowContact: LeaderContact[] =
    data.highVolumeLowContact.map((leader) => ({
      id: leader.userId,
      name: leader.fullName,
      role: normalizeRole(leader.roleType),
      market: marketToString(leader.market),
      country: leader.market.country,
      city: leader.market.city,
      daysSinceLastContact: leader.daysSinceLastContact,
      preferredChannel: normalizeChannel(leader.preferredChannel),
      businessVolume: leader.businessVolume,
      lastContactDate: leader.lastContactAt,
    }));

  const summary: CommunicationMetrics = {
    contactedLast7Days: data.summary.contactedPercentage,
    contactedLast14Days: data.summary.contactedPercentage,
    contactedLast30Days: data.summary.contactedPercentage,
    overdueFollowups: 0,
    totalLeaders: data.summary.totalLeaders,
  };

  return { summary, notContacted, highVolumeLowContact };
}

export async function getFollowups(): Promise<FollowUp[]> {
  const data = await apiFetch<FollowupsResponse>(
    "/globalview/communication/followups"
  );

  return data.followUps.map((f) => ({
    id: f.followUpId,
    leaderId: f.leaderUserId,
    leaderName: f.leaderName,
    taskDescription: f.title,
    owner: f.ownerName || f.ownerGvUserId,
    dueDate: f.dueDate,
    status: normalizeFollowupStatus(f.status, f.dueDate),
    source: normalizeFollowupSource(f.source),
  }));
}

export async function getWeeklyBoard(date?: string): Promise<WeeklyBoardLeader[]> {
  const params = new URLSearchParams();
  if (date) params.set("date", date);

  const data = await apiFetch<WeeklyBoardResponse>(
    `/globalview/communication/weekly/board?${params.toString()}`
  );

  return data.leaders.map((leader) => ({
    id: leader.leaderUserId,
    name: leader.fullName,
    phone: leader.phone,
    market: marketToString(leader.market),
    status: leader.status,
    statusNotes: leader.statusNotes || null,
    followUp: leader.followUp || null,
  }));
}

export async function getWeeklySummary(
  date?: string
): Promise<WeeklyBoardSummary> {
  const params = new URLSearchParams();
  if (date) params.set("date", date);

  return apiFetch<WeeklySummaryResponse>(
    `/globalview/communication/weekly/summary?${params.toString()}`
  );
}

export async function getWeeklyBoardData(
  date?: string
): Promise<WeeklyBoardData> {
  const params = new URLSearchParams();
  if (date) params.set("date", date);

  const data = await apiFetch<WeeklyBoardResponse>(
    `/globalview/communication/weekly/board?${params.toString()}`
  );

  return {
    weekStart: data.weekStart,
    weekEnd: data.weekEnd,
    leaders: data.leaders.map((leader) => ({
      id: leader.leaderUserId,
      name: leader.fullName,
      phone: leader.phone,
      market: marketToString(leader.market),
      status: leader.status,
      statusNotes: leader.statusNotes || null,
      followUp: leader.followUp || null,
    })),
  };
}

export async function updateWeeklyStatus({
  leaderUserId,
  date,
  status,
  notes,
}: {
  leaderUserId: string;
  date: string;
  status: "NOT_CONTACTED" | "CONTACTED" | "NEED_FOLLOWUP" | "COMPLETED";
  notes?: string;
}) {
  return apiFetch<{ message: string; status: unknown }>(
    "/globalview/communication/weekly/status",
    {
      method: "POST",
      body: JSON.stringify({ leaderUserId, date, status, notes }),
    }
  );
}
