export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const phaseLabel: Record<string, string> = {
  FASE_LIGA: "Fase Liga",
  OCTAVOS: "Octavos",
  CUARTOS: "Cuartos",
  SEMIFINALES: "Semis",
  FINAL: "Final",
};

export default async function BackofficePartidosPage() {
  const session = await auth();
  if (!session?.user || !["EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ phase: "asc" }, { matchDate: "desc" }],
  });

  return (
    <main className="container mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bebas text-4xl tracking-wider">Gestión de Partidos</h1>
          <p className="text-gray-500 text-sm">{matches.length} partidos</p>
        </div>
        <Link
          href="/backoffice/partidos/nuevo"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          + Nuevo partido
        </Link>
      </div>
      <div className="grid gap-2">
        {matches.map((match) => (
          <div key={match.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {match.homeTeam.name} vs {match.awayTeam.name}
              </p>
              <p className="text-gray-500 text-xs">
                {phaseLabel[match.phase]} · J{match.matchday} ·{" "}
                {match.status === "PLAYED" ? `${match.homeGoals}-${match.awayGoals}` : "Programado"}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/backoffice/partidos/${match.id}/editar`}
                className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
