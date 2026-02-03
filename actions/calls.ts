"use server";

import { apiFetch } from "./_core";
import {
  WeeklyCallListItem,
  WeeklyCallDetail,
  WeeklyCallsMetrics,
} from "@/lib/types";

interface CallsResponse {
  calls: Array<{
    callId: string;
    title: string;
    meetingLink: string;
    scheduledAt: string;
    isRecurring: boolean;
    requiredRoles: string[];
    attendanceSummary?: {
      total: number;
      present: number;
      absent?: number;
      attendanceRate: number;
    };
  }>;
}

function normalizeRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

interface CallSummaryResponse {
  call: {
    callId: string;
    title: string;
    meetingLink: string;
    scheduledAt: string;
    requiredRoles: string[];
  };
  attendance: Array<{
    leaderUserId: string;
    leaderName?: string;
    status: "PRESENT" | "ABSENT";
    participationScore: 0 | 1 | 2 | 3;
  }>;
  actionItems: Array<{
    itemId: string;
    title: string;
    ownerGvUserId: string;
    ownerName?: string;
    status: "OPEN" | "COMPLETED";
  }>;
  attendanceSummary?: {
    total: number;
    present: number;
    absent: number;
    attendanceRate: number;
  };
}

export async function getCalls(): Promise<WeeklyCallListItem[]> {
  const data = await apiFetch<CallsResponse>("/globalview/calls");

  return data.calls.map((call) => ({
    id: call.callId,
    callName: call.title,
    meetingLink: call.meetingLink,
    dateTime: call.scheduledAt,
    requiredRoles: (call.requiredRoles || []).map(normalizeRole),
    attendancePercent: call.attendanceSummary?.attendanceRate ?? 0,
  }));
}

export async function getCallSummary(callId: string): Promise<WeeklyCallDetail> {
  const data = await apiFetch<CallSummaryResponse>(
    `/globalview/calls/${callId}/summary`
  );

  return {
    id: data.call.callId,
    callName: data.call.title,
    meetingLink: data.call.meetingLink,
    dateTime: data.call.scheduledAt,
    requiredRoles: (data.call.requiredRoles || []).map(normalizeRole),
    attendancePercent: data.attendanceSummary?.attendanceRate ?? 0,
    attendees: data.attendance.map((a) => ({
      id: a.leaderUserId,
      name: a.leaderName || a.leaderUserId,
      present: a.status === "PRESENT",
      participationScore: a.participationScore,
    })),
    actionItems: data.actionItems.map((item) => ({
      id: item.itemId,
      description: item.title,
      owner: item.ownerName || item.ownerGvUserId,
      status: item.status === "COMPLETED" ? "completed" : "pending",
    })),
  };
}

export async function getWeeklyCallsMetrics(): Promise<WeeklyCallsMetrics> {
  const calls = await getCalls();
  const sorted = [...calls].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  const latest = sorted[0];
  const previous = sorted[1];
  let noShowCount = 0;

  if (latest) {
    const summary = await getCallSummary(latest.id);
    noShowCount = summary.attendees.filter((a) => !a.present).length;
  }

  return {
    attendancePercent: latest?.attendancePercent ?? 0,
    lastWeekAttendancePercent: previous?.attendancePercent ?? 0,
    noShowCount,
    missedConsecutiveCount: 0,
  };
}
