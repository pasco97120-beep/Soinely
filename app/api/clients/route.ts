import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

export async function GET() {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { idelUserId: idelUser.id },
    orderBy: { nom: "asc" },
    include: { _count: { select: { documents: true } } },
  });

  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { nom, prenom, dateNaissance, adresse, telephone, notes } = await req.json();
  if (!nom?.trim() || !prenom?.trim()) {
    return NextResponse.json({ error: "nom et prenom requis" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      idelUserId: idelUser.id,
      nom: nom.trim(),
      prenom: prenom.trim(),
      dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
      adresse: adresse?.trim() || null,
      telephone: telephone?.trim() || null,
      notes: notes?.trim() || null,
    },
  });

  return NextResponse.json({ client });
}
