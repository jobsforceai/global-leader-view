import { NextResponse } from "next/server";

const API_BASE =
  process.env.GLOBALVIEW_API_BASE_URL ||
  process.env.NEXT_PUBLIC_GLOBALVIEW_API_BASE_URL ||
  "";

export async function POST(request: Request) {
  if (!API_BASE) {
    return NextResponse.json(
      { message: "GLOBALVIEW_API_BASE_URL is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const backendUrl = `${API_BASE.replace(/\/$/, "")}/globalview/auth/login`;

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  const response = new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
