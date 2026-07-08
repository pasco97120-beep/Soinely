import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (idelUser.cabinetId) return NextResponse.json({ error: "déjà dans un cabinet" }, { status: 409 });

  const { nom } = await req.json();
  if (!nom) return NextResponse.json({ error: "nom requis" }, { status: 400 });

  const cabinet = await prisma.cabinet.create({ data: { nom, codeInvitation: genCode() } });
  await prisma.idelUser.update({
    where: { id: idelUser.id },
    data: { cabinetId: cabinet.id, cabinetRole: "proprietaire" },
  });

  return NextResponse.json({ ok: true, cabinet });
}
