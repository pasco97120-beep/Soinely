import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const tp = await prisma.tourneePatient.update({
    where: { id: Number(params.id) },
    data: {
      statutVisite: body.statutVisite ?? undefined,
      notesVisite: body.notesVisite ?? undefined,
      heureVisite: body.heureVisite ?? undefined,
    },
  });

  return NextResponse.json(tp);
}
