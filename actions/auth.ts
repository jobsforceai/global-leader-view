"use server";

import { apiFetch } from "./_core";

interface LoginResponse {
  token: string;
  user: {
    gvUserId: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    scopes: { countries: string[]; regions: string[]; cities: string[] };
    createdByAdminId: string;
    lastLoginAt: string;
  };
}

export async function loginGlobalView(email: string, password: string) {
  return apiFetch<LoginResponse>("/globalview/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    requireAuth: false,
  });
}
