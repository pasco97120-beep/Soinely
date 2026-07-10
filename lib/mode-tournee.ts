import { cookies } from "next/headers";

const COOKIE_NAME = "soinely-mode-tournee";

// Lecture côté Server Component : SCR-001 / Design Book Loi n°6 — l'interface doit
// rester confortable en plein soleil, à une main, sur smartphone.
export function isModeTournee() {
  return cookies().get(COOKIE_NAME)?.value === "1";
}

export const MODE_TOURNEE_COOKIE = COOKIE_NAME;
