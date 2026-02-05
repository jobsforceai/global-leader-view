"use server";

import { apiFetch } from "./_core";

export async function clearGlobalViewCache() {
  return apiFetch<{ message: string }>(`/globalview/cache/clear`, {
    method: "POST",
  });
}
