"use server";

import { cookies } from "next/headers";

const DEFAULT_BASE = "/api/v1";
const API_BASE =
  process.env.GLOBALVIEW_API_BASE_URL ||
  process.env.NEXT_PUBLIC_GLOBALVIEW_API_BASE_URL ||
  DEFAULT_BASE;

export async function getAuthTokenValue(): Promise<string | null> {
  const cookieStore = await cookies();
  return (
    cookieStore.get("gv_token")?.value ||
    cookieStore.get("globalview_token")?.value ||
    process.env.GLOBALVIEW_API_TOKEN ||
    null
  );
}

function buildUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { requireAuth?: boolean } = {}
): Promise<T> {
  const { requireAuth = true, headers, ...rest } = options;
  const token = await getAuthTokenValue();

  if (requireAuth && !token) {
    throw new Error(
      "Missing Global View token. Set gv_token/globalview_token cookie or GLOBALVIEW_API_TOKEN env var."
    );
  }

  const res = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Global View API error ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}
