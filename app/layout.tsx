import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOINELY — Assistant infirmier",
  description: "Gestion des patients dans les tournées des infirmier(e)s",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
