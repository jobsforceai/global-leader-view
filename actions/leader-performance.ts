"use server";

import { apiFetch } from "./_core";
import {
  LeaderPerformanceGridData,
  LeaderPerformanceDetail,
} from "@/lib/types";

export async function getLeaderPerformanceGrid(options?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
  status?: "ACTIVE" | "INACTIVE";
  roleType?: string;
}): Promise<LeaderPerformanceGridData> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.search) params.set("search", options.search);
  if (options?.sortBy) params.set("sortBy", options.sortBy);
  if (options?.sortOrder) params.set("sortOrder", options.sortOrder);
  if (options?.startDate) params.set("startDate", options.startDate);
  if (options?.endDate) params.set("endDate", options.endDate);
  if (options?.status) params.set("status", options.status);
  if (options?.roleType) params.set("roleType", options.roleType);

  const query = params.toString();
  return apiFetch<LeaderPerformanceGridData>(
    `/globalview/bi/leader-performance${query ? `?${query}` : ""}`
  );
}

export async function getLeaderPerformanceDetail(
  userId: string,
  options?: { startDate?: string; endDate?: string }
): Promise<LeaderPerformanceDetail> {
  const params = new URLSearchParams();
  if (options?.startDate) params.set("startDate", options.startDate);
  if (options?.endDate) params.set("endDate", options.endDate);

  const query = params.toString();
  return apiFetch<LeaderPerformanceDetail>(
    `/globalview/bi/leader-performance/${userId}${query ? `?${query}` : ""}`
  );
}
