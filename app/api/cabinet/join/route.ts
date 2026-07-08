import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

export async function POST(req: NextRequest) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (idelUser.cabinetId) return NextResponse.json({ error: "déjà dans un cabinet" }, { status: 409 });

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "code requis" }, { status: 400 });

  const cabinet = await prisma.cabinet.findUnique({ where: { codeInvitation: code.toUpperCase() } });
  if (!cabinet) return NextResponse.json({ error: "code introuvable" }, { status: 404 });

  await prisma.idelUser.update({
    where: { id: idelUser.id },
    data: { cabinetId: cabinet.id, cabinetRole: "membre" },
  });

  return NextResponse.json({ ok: true });
}
