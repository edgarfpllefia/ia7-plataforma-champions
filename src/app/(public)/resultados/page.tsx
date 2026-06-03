export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

const phases = [
  { key: "FINAL", label: "Final" },
  { key: "SEMIFINALES", label: "Semifinales" },
  { key: "CUARTOS", label: "Cuartos de Final" },
  { key: "OCTAVOS", label: "Octavos de Final" },
  { key: "FASE_LIGA", label: "Fase de Liga" },
];

type SearchParams = { fase?: string; jornada?: string };

export default async function ResultadosPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { fase, jornada } = await searchParams;
  const activePhase = fase && phases.find(p => p.key === fase) ? fase : undefined;

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    where: {
      status: "PLAYED",
      ...(activePhase ? { phase: activePhase as never } : {}),
    },
    orderBy: { matchDate: "desc" },
  });

  const jornadas = [...new Set(
    matches.filter(m => m.phase === "FASE_LIGA").map(m => m.matchday)
  )].sort((a, b) => b - a);

  const activeJornada = jornada ? parseInt(jornada) : jornadas[0];

  const displayMatches = activePhase === "FASE_LIGA"
    ? matches.filter(m => m.matchday === activeJornada)
    : !activePhase
    ? matches.filter(m => m.phase !== "FASE_LIGA" || m.matchday === activeJornada)
    : matches;

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-black mb-2">Resultados</h1>
      <p className="text-gray-500 mb-6">UEFA Champions League 2025/26</p>

      {/* Filtros de fase */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link href="/resultados" className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${!activePhase ? "bg-blue-600 border-blue-500 text-white" : "bg-white/3 border-white/10 text-gray-400 hover:bg-white/8 hover:text-white"}`}>
          Todos
        </Link>
        {phases.map(p => (
          <Link key={p.key} href={`/resultados?fase=${p.key}`}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activePhase === p.key ? "bg-blue-600 border-blue-500 text-white" : "bg-white/3 border-white/10 text-gray-400 hover:bg-white/8 hover:text-white"}`}>
            {p.label}
          </Link>
        ))}
      </div>

      {/* Sub-filtro jornada */}
      {(activePhase === "FASE_LIGA" || !activePhase) && jornadas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {jornadas.map(j => (
            <Link key={j}
              href={activePhase ? `/resultados?fase=FASE_LIGA&jornada=${j}` : `/resultados?jornada=${j}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeJornada === j ? "bg-white/15 border-white/30 text-white" : "bg-white/3 border-white/8 text-gray-500 hover:bg-white/8 hover:text-white"}`}>
              J{j}
            </Link>
          ))}
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {displayMatches.map((match) => (
          <Link key={match.id} href={`/partidos/${match.id}`}>
            <div className="bg-white/3 border border-white/5 rounded-2xl p-4 hover:bg-white/6 transition-all flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="text-sm font-bold text-right hidden sm:block">{match.homeTeam.name}</span>
                <div className="w-8 h-8 flex-shrink-0">
                  {match.homeTeam.logoUrl && (
                    <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={32} height={32} className="object-contain w-full h-full" unoptimized />
                  )}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-2 min-w-[80px] text-center">
                <span className="text-lg font-black">{match.homeGoals} - {match.awayGoals}</span>
              </div>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 flex-shrink-0">
                  {match.awayTeam.logoUrl && (
                    <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={32} height={32} className="object-contain w-full h-full" unoptimized />
                  )}
                </div>
                <span className="text-sm font-bold hidden sm:block">{match.awayTeam.name}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-gray-600 block">
                  {new Date(match.matchDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="text-xs text-gray-500">
                  {phases.find(p => p.key === match.phase)?.label}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {displayMatches.length === 0 && (
          <p className="text-gray-500 text-sm py-8 text-center">No hay resultados en esta selección.</p>
        )}
      </div>
    </main>
  );
}
