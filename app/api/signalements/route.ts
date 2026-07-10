import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

const TYPES_VALIDES = new Set(["erreur", "amelioration", "lien_inactif", "autre"]);

export async function POST(req: NextRequest) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { ficheId, type, message } = await req.json();
  const cleanMessage = (message ?? "").toString().trim();

  if (!ficheId || !TYPES_VALIDES.has(type) || !cleanMessage) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  if (cleanMessage.length > 2000) {
    return NextResponse.json({ error: "message trop long" }, { status: 400 });
  }

  const signalement = await prisma.signalement.create({
    data: { ficheId: Number(ficheId), idelUserId: idelUser.id, type, message: cleanMessage },
  });

  return NextResponse.json({ id: signalement.id });
}
