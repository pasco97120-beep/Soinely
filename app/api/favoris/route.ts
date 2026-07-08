import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

export async function POST(req: NextRequest) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { ficheId } = await req.json();
  if (!ficheId) return NextResponse.json({ error: "missing ficheId" }, { status: 400 });

  const existing = await prisma.favori.findUnique({
    where: { idelUserId_ficheId: { idelUserId: idelUser.id, ficheId: Number(ficheId) } },
  });

  if (existing) {
    await prisma.favori.delete({ where: { id: existing.id } });
    return NextResponse.json({ favori: false });
  }

  await prisma.favori.create({ data: { idelUserId: idelUser.id, ficheId: Number(ficheId) } });
  return NextResponse.json({ favori: true });
}
