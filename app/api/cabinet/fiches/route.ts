import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

export async function POST(req: NextRequest) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!idelUser.cabinetId) return NextResponse.json({ error: "no cabinet" }, { status: 400 });

  const { ficheId } = await req.json();
  if (!ficheId) return NextResponse.json({ error: "missing ficheId" }, { status: 400 });

  const cabinetId = idelUser.cabinetId;
  const existing = await prisma.cabinetFiche.findUnique({
    where: { cabinetId_ficheId: { cabinetId, ficheId: Number(ficheId) } },
  });

  if (existing) {
    await prisma.cabinetFiche.delete({ where: { id: existing.id } });
    return NextResponse.json({ shared: false });
  }

  await prisma.cabinetFiche.create({ data: { cabinetId, ficheId: Number(ficheId) } });
  return NextResponse.json({ shared: true });
}
