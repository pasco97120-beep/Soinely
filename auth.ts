import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        username: { label: "Identifiant" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;

        const utilisateur = await prisma.utilisateur.findUnique({
          where: { username },
          include: { infirmier: true },
        });
        if (!utilisateur || !utilisateur.actif) return null;

        const valid = await bcrypt.compare(password, utilisateur.passwordHash);
        if (!valid) return null;

        await prisma.utilisateur.update({
          where: { id: utilisateur.id },
          data: { derniereConnexion: new Date() },
        });

        return {
          id: String(utilisateur.id),
          name: `${utilisateur.infirmier.prenom} ${utilisateur.infirmier.nom}`,
          username: utilisateur.username,
          role: utilisateur.role,
          infirmierId: utilisateur.infirmierId,
          accountType: "hospital",
        } as any;
      },
    }),
    Credentials({
      id: "idel-credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string | undefined)?.toLowerCase().trim();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const idelUser = await prisma.idelUser.findUnique({ where: { email } });
        if (!idelUser) return null;

        const valid = await bcrypt.compare(password, idelUser.passwordHash);
        if (!valid) return null;

        return {
          id: String(idelUser.id),
          name: `${idelUser.prenom} ${idelUser.nom}`,
          idelUserId: idelUser.id,
          accountType: "idel",
        } as any;
      },
    }),
  ],
});
