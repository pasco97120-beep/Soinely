import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const client = await prisma.client.findUnique({
    where: { id: Number(params.id) },
    include: { documents: { orderBy: { createdAt: "desc" } } },
  });

  if (!client || client.idelUserId !== idelUser.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const client = await prisma.client.findUnique({ where: { id: Number(params.id) } });
  if (!client || client.idelUserId !== idelUser.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.client.delete({ where: { id: client.id } });
  return NextResponse.json({ ok: true });
}
