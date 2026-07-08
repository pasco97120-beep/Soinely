import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const alerte = await prisma.alerte.update({
    where: { id: Number(params.id) },
    data: {
      statut: body.statut ?? undefined,
      dateTraitement: body.statut === "traitee" ? new Date() : undefined,
    },
  });

  return NextResponse.json(alerte);
}
