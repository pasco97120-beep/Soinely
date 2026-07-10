import type { NextAuthConfig } from "next-auth";

const hospitalPrefixes = ["/dashboard", "/patients", "/tournees", "/transmissions", "/alertes"];
const idelAuthPrefixes = ["/cabinet", "/equipe", "/accueil", "/profil"];

export default {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      const accountType = (auth?.user as any)?.accountType;
      const isLoggedIn = !!auth?.user;

      if (path === "/login") {
        if (isLoggedIn && accountType === "hospital") return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }
      if (path === "/connexion" || path === "/inscription") {
        if (isLoggedIn && accountType === "idel") return Response.redirect(new URL("/accueil", nextUrl));
        return true;
      }

      if (hospitalPrefixes.some((p) => path.startsWith(p))) {
        if (isLoggedIn && accountType === "hospital") return true;
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (idelAuthPrefixes.some((p) => path.startsWith(p))) {
        if (isLoggedIn && accountType === "idel") return true;
        return Response.redirect(new URL("/connexion", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.accountType = u.accountType;
        if (u.accountType === "hospital") {
          token.role = u.role;
          token.infirmierId = u.infirmierId;
          token.username = u.username;
        }
        if (u.accountType === "idel") {
          token.idelUserId = u.idelUserId;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const s = session.user as any;
        s.accountType = token.accountType;
        s.role = token.role;
        s.infirmierId = token.infirmierId;
        s.username = token.username;
        s.idelUserId = token.idelUserId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
