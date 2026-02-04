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
import { getAuthTokenValue } from "./_core";

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
    followUpId?: string;
    leaderUserId: string;
    leaderName?: string;
    title: string;
    ownerGvUserId?: string;
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

async function getCurrentGvUserId(): Promise<string | null> {
  const token = await getAuthTokenValue();
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    return decoded.gvUserId || decoded.id || decoded.userId || null;
  } catch {
    return null;
  }
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

export async function getFollowups(options?: {
  ownerGvUserId?: string;
  status?: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "RESOLVED" | "IGNORED";
  dueBefore?: string;
  page?: number;
  limit?: number;
}): Promise<FollowUp[]> {
  const params = new URLSearchParams();
  const ownerFromToken =
    options?.ownerGvUserId || (await getCurrentGvUserId());
  if (ownerFromToken) params.set("ownerGvUserId", ownerFromToken);
  if (options?.status) params.set("status", options.status);
  if (options?.dueBefore) params.set("dueBefore", options.dueBefore);
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));

  const query = params.toString();
  const data = await apiFetch<FollowupsResponse>(
    `/globalview/communication/followups${query ? `?${query}` : ""}`
  );

  return data.followUps.map((f) => ({
    id:
      f.followUpId ||
      `${f.leaderUserId}-${f.dueDate}-${f.title}`.replace(/\s+/g, "-"),
    leaderId: f.leaderUserId,
    leaderName: f.leaderName || f.leaderUserId,
    taskDescription: f.title,
    owner: f.ownerName || f.ownerGvUserId || "Unassigned",
    dueDate: f.dueDate,
    status: normalizeFollowupStatus(f.status, f.dueDate),
    source: f.source ? normalizeFollowupSource(f.source) : "manual",
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
