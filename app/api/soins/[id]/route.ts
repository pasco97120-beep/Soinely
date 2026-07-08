import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const soin = await prisma.soin.update({
    where: { id: Number(params.id) },
    data: {
      realise: Boolean(body.realise),
      observations: body.observations ?? undefined,
      motifNonRealise: body.motifNonRealise ?? undefined,
    },
  });

  return NextResponse.json(soin);
}
