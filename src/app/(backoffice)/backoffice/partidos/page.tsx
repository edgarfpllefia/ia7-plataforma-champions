export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DeleteMatchButton from "./DeleteMatchButton";

const phases = [
  { key: "FASE_LIGA", label: "Fase Liga" },
  { key: "OCTAVOS", label: "Octavos" },
  { key: "CUARTOS", label: "Cuartos" },
  { key: "SEMIFINALES", label: "Semis" },
  { key: "FINAL", label: "Final" },
];

type SearchParams = { fase?: string; jornada?: string };

export default async function BackofficePartidosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user || !["EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const { fase, jornada } = await searchParams;
  const activePhase = fase && phases.find((p) => p.key === fase) ? fase : "FASE_LIGA";
  const PAGE_SIZE = 18;

  const allMatches = await prisma.match.findMany({
    where: { phase: activePhase as never },
    include: { homeTeam: true, awayTeam: true },
    orderBy: { matchDate: "desc" },
  });

  // Jornadas disponibles para fase liga
  const jornadas = activePhase === "FASE_LIGA"
    ? [...new Set(allMatches.map((m) => m.matchday))].sort((a, b) => b - a)
    : [];

  const activeJornada = jornada ? parseInt(jornada) : jornadas[0];

  // Filtrar por jornada si es fase liga
  const matches = activePhase === "FASE_LIGA" && activeJornada
    ? allMatches.filter((m) => m.matchday === activeJornada)
    : allMatches;

  const total = allMatches.length;

  return (
    <main className="container mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bebas text-4xl tracking-wider">Gestión de Partidos</h1>
          <p className="text-gray-500 text-sm">{total} partidos en esta fase</p>
        </div>
        <Link
          href="/backoffice/partidos/nuevo"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          + Nuevo partido
        </Link>
      </div>

      {/* Filtros de fase */}
      <div className="flex flex-wrap gap-2 mb-4">
        {phases.map((p) => (
          <Link
            key={p.key}
            href={`/backoffice/partidos?fase=${p.key}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activePhase === p.key
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-white/3 border-white/10 text-gray-400 hover:bg-white/8 hover:text-white"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* Filtro de jornada (solo fase liga) */}
      {activePhase === "FASE_LIGA" && jornadas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {jornadas.map((j) => (
            <Link
              key={j}
              href={`/backoffice/partidos?fase=FASE_LIGA&jornada=${j}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeJornada === j
                  ? "bg-white/15 border-white/30 text-white"
                  : "bg-white/3 border-white/8 text-gray-500 hover:bg-white/8 hover:text-white"
              }`}
            >
              J{j}
            </Link>
          ))}
        </div>
      )}

      {/* Lista de partidos */}
      <div className="grid gap-2">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {match.homeTeam.name} vs {match.awayTeam.name}
              </p>
              <p className="text-gray-500 text-xs">
                {phases.find((p) => p.key === match.phase)?.label} · J{match.matchday} ·{" "}
                {match.status === "PLAYED"
                  ? `${match.homeGoals}-${match.awayGoals}`
                  : new Date(match.matchDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  match.status === "PLAYED"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {match.status === "PLAYED" ? "Jugado" : "Programado"}
              </span>
              <Link
                href={`/backoffice/partidos/${match.id}/editar`}
                className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
              >
                Editar
              </Link>
              <DeleteMatchButton id={match.id} />
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-10">No hay partidos en esta selección.</p>
        )}
      </div>
    </main>
  );
}
