import { NextRequest, NextResponse } from "next/server";
import { MODE_TOURNEE_COOKIE } from "@/lib/mode-tournee";

export async function POST(req: NextRequest) {
  const { active } = await req.json();
  const res = NextResponse.json({ active: !!active });
  res.cookies.set(MODE_TOURNEE_COOKIE, active ? "1" : "0", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
