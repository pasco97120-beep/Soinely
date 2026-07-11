import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

const MAX_DATA_URL_LENGTH = 2_000_000;

export async function POST(req: NextRequest) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { dataUrl } = await req.json();

  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "photo invalide" }, { status: 400 });
  }
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json({ error: "Photo trop volumineuse, réessayez" }, { status: 413 });
  }

  await prisma.idelUser.update({ where: { id: idelUser.id }, data: { photoUrl: dataUrl } });
  return NextResponse.json({ photoUrl: dataUrl });
}

export async function DELETE() {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await prisma.idelUser.update({ where: { id: idelUser.id }, data: { photoUrl: null } });
  return NextResponse.json({ ok: true });
}
