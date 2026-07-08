import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  const infirmierId = (session?.user as any)?.infirmierId as number | undefined;
  if (!session || !infirmierId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.admissionId || !body.contenu || !body.quart) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const transmission = await prisma.transmission.create({
    data: {
      admissionId: Number(body.admissionId),
      infirmierId,
      quart: body.quart,
      contenu: body.contenu,
      priorite: body.priorite ?? "normale",
    },
  });

  return NextResponse.json(transmission);
}
