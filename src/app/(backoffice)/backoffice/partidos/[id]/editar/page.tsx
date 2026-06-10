export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import EditarPartidoClient from "./EditarPartidoClient";

export default async function EditarPartidoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !["EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const { id } = await params;
  const [match, teams] = await Promise.all([
    prisma.match.findUnique({
      where: { id },
      include: { homeTeam: true, awayTeam: true },
    }),
    prisma.team.findMany({
      where: { group: { not: "0" } },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!match) notFound();

  return <EditarPartidoClient match={match} teams={teams} />;
}
