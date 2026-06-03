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

export default async function PartidosPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { fase, jornada } = await searchParams;
  const activePhase = fase && phases.find(p => p.key === fase) ? fase : undefined;

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    where: activePhase ? { phase: activePhase as never } : undefined,
    orderBy: [{ matchDate: "desc" }],
  });

  // Agrupar por fase
  const byPhase = phases.reduce((acc, p) => {
    const list = matches.filter(m => m.phase === p.key);
    if (list.length > 0) acc[p.key] = list;
    return acc;
  }, {} as Record<string, typeof matches>);

  // Si hay filtro de fase liga, agrupar también por jornada
  const jornadas = activePhase === "FASE_LIGA" || !activePhase
    ? [...new Set(matches.filter(m => m.phase === "FASE_LIGA").map(m => m.matchday))].sort((a, b) => b - a)
    : [];

  const activeJornada = jornada ? parseInt(jornada) : jornadas[0];

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-black mb-2">Partidos</h1>
      <p className="text-gray-500 mb-6">UEFA Champions League 2025/26</p>

      {/* Filtros de fase */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/partidos"
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${!activePhase ? "bg-blue-600 border-blue-500 text-white" : "bg-white/3 border-white/10 text-gray-400 hover:bg-white/8 hover:text-white"}`}
        >
          Todos
        </Link>
        {phases.map(p => (
          <Link
            key={p.key}
            href={`/partidos?fase=${p.key}`}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activePhase === p.key ? "bg-blue-600 border-blue-500 text-white" : "bg-white/3 border-white/10 text-gray-400 hover:bg-white/8 hover:text-white"}`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* Sub-filtro de jornada (solo para fase liga) */}
      {(activePhase === "FASE_LIGA" || !activePhase) && jornadas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {jornadas.map(j => (
            <Link
              key={j}
              href={activePhase ? `/partidos?fase=FASE_LIGA&jornada=${j}` : `/partidos?jornada=${j}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeJornada === j ? "bg-white/15 border-white/30 text-white" : "bg-white/3 border-white/8 text-gray-500 hover:bg-white/8 hover:text-white"}`}
            >
              J{j}
            </Link>
          ))}
        </div>
      )}

      {/* Partidos */}
      {!activePhase ? (
        // Vista "Todos" — mostrar por fases
        <div className="space-y-10">
          {phases.map(p => {
            const phaseMatches = byPhase[p.key];
            if (!phaseMatches) return null;
            const displayMatches = p.key === "FASE_LIGA"
              ? phaseMatches.filter(m => m.matchday === activeJornada)
              : phaseMatches;
            if (displayMatches.length === 0) return null;
            return (
              <div key={p.key}>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
                  {p.label}
                  {p.key === "FASE_LIGA" && ` — Jornada ${activeJornada}`}
                </h2>
                <MatchList matches={displayMatches} />
              </div>
            );
          })}
        </div>
      ) : activePhase === "FASE_LIGA" ? (
        // Vista fase liga con filtro de jornada
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
            Fase de Liga — Jornada {activeJornada}
          </h2>
          <MatchList matches={(byPhase["FASE_LIGA"] ?? []).filter(m => m.matchday === activeJornada)} />
        </div>
      ) : (
        // Vista fase eliminatoria
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
            {phases.find(p => p.key === activePhase)?.label}
          </h2>
          <MatchList matches={byPhase[activePhase] ?? []} />
        </div>
      )}
    </main>
  );
}

type Match = {
  id: string;
  matchday: number;
  status: string;
  phase: string;
  homeGoals: number | null;
  awayGoals: number | null;
  matchDate: Date;
  homeTeam: { name: string; logoUrl: string | null };
  awayTeam: { name: string; logoUrl: string | null };
};

function MatchList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <p className="text-gray-500 text-sm py-8 text-center">No hay partidos en esta selección.</p>;
  }
  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <Link key={match.id} href={`/partidos/${match.id}`}>
          <div className="group bg-white/3 border border-white/5 rounded-2xl p-5 hover:bg-white/6 hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="text-sm font-bold text-right hidden sm:block">{match.homeTeam.name}</span>
                <div className="w-9 h-9 flex-shrink-0">
                  {match.homeTeam.logoUrl ? (
                    <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={36} height={36} className="object-contain w-full h-full" unoptimized />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">{match.homeTeam.name.charAt(0)}</div>
                  )}
                </div>
              </div>
              <div className="text-center min-w-[90px]">
                {match.status === "PLAYED" ? (
                  <div className="bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-xl font-black">{match.homeGoals} - {match.awayGoals}</span>
                  </div>
                ) : (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                    <span className="text-blue-400 text-xs font-bold">
                      {new Date(match.matchDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 flex-shrink-0">
                  {match.awayTeam.logoUrl ? (
                    <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={36} height={36} className="object-contain w-full h-full" unoptimized />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">{match.awayTeam.name.charAt(0)}</div>
                  )}
                </div>
                <span className="text-sm font-bold hidden sm:block">{match.awayTeam.name}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${match.status === "PLAYED" ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"}`}>
                {match.status === "PLAYED" ? "✓" : "🕐"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
