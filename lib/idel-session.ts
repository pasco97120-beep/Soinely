import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getIdelUser() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.accountType !== "idel") return null;

  return prisma.idelUser.findUnique({
    where: { id: user.idelUserId },
    include: { cabinet: true },
  });
}
