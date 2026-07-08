import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  prenom: z.string().min(1),
  nom: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  cabinetMode: z.enum(["aucun", "creer", "rejoindre"]),
  cabinetNom: z.string().optional(),
  codeInvitation: z.string().optional(),
});

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  const { prenom, nom, password, cabinetMode, cabinetNom, codeInvitation } = parsed.data;
  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.idelUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  let cabinetId: number | undefined;
  let cabinetRole: string | undefined;

  if (cabinetMode === "creer") {
    if (!cabinetNom) return NextResponse.json({ error: "Nom de cabinet requis." }, { status: 400 });
    const cabinet = await prisma.cabinet.create({
      data: { nom: cabinetNom, codeInvitation: genCode() },
    });
    cabinetId = cabinet.id;
    cabinetRole = "proprietaire";
  } else if (cabinetMode === "rejoindre") {
    if (!codeInvitation) return NextResponse.json({ error: "Code d'invitation requis." }, { status: 400 });
    const cabinet = await prisma.cabinet.findUnique({ where: { codeInvitation: codeInvitation.toUpperCase() } });
    if (!cabinet) return NextResponse.json({ error: "Code d'invitation introuvable." }, { status: 404 });
    cabinetId = cabinet.id;
    cabinetRole = "membre";
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.idelUser.create({
    data: { email, passwordHash, prenom, nom, cabinetId, cabinetRole },
  });

  return NextResponse.json({ ok: true });
}
