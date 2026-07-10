import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; docId: string } }) {
  const idelUser = await getIdelUser();
  if (!idelUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const document = await prisma.clientDocument.findUnique({
    where: { id: Number(params.docId) },
    include: { client: true },
  });

  if (!document || document.clientId !== Number(params.id) || document.client.idelUserId !== idelUser.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.clientDocument.delete({ where: { id: document.id } });
  return NextResponse.json({ ok: true });
}
