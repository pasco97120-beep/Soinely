import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

const TYPES = new Set(["prescription", "carte_vitale", "autre"]);
// Vercel limite le corps des requêtes de route handler à ~4,5 Mo : on refuse plus tôt
// avec un message clair plutôt que de laisser la plateforme couper la requête.
const MAX_DATA_URL_LENGTH = 4_000_000;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const client = await prisma.client.findUnique({ where: { id: Number(params.id) } });
  if (!client || client.idelUserId !== idelUser.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const { type, dataUrl, label } = await req.json();

  if (!TYPES.has(type)) {
    return NextResponse.json({ error: "type invalide" }, { status: 400 });
  }
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "photo invalide" }, { status: 400 });
  }
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json({ error: "Photo trop volumineuse, réessayez (elle sera compressée automatiquement)" }, { status: 413 });
  }

  const document = await prisma.clientDocument.create({
    data: { clientId: client.id, type, dataUrl, label: label?.trim() || null },
  });

  return NextResponse.json({
    document: { id: document.id, type: document.type, label: document.label, createdAt: document.createdAt, dataUrl },
  });
}
