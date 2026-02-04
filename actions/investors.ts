"use server";

import { apiFetch } from "./_core";
import { Investor } from "@/lib/types";

interface InvestorsResponse {
  investors: Array<{
    userId: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
    country?: string | null;
    region?: string | null;
    city?: string | null;
    status?: string | null;
    isPackageActive?: boolean | null;
    totalInvested?: number | null;
    capTotal?: number | null;
    capRemaining?: number | null;
  }>;
  pagination?: { currentPage: number; totalPages: number; totalCount: number };
}

export async function getInvestors(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<Investor[]> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.search) params.set("search", options.search);

  const data = await apiFetch<InvestorsResponse>(
    `/globalview/investors?${params.toString()}`
  );

  return data.investors.map((inv) => ({
    id: inv.userId,
    name: inv.fullName,
    email: inv.email || null,
    phone: inv.phone || null,
    country: inv.country || null,
    region: inv.region || null,
    city: inv.city || null,
    status: inv.status || null,
    isPackageActive: Boolean(inv.isPackageActive),
    totalInvested: inv.totalInvested ?? 0,
    capTotal: inv.capTotal ?? 0,
    capRemaining: inv.capRemaining ?? 0,
  }));
}
