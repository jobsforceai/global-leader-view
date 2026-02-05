import { NextResponse } from "next/server";
import { clearGlobalViewCache } from "@/actions/admin";

export async function POST() {
  const result = await clearGlobalViewCache();
  return NextResponse.json(result);
}
