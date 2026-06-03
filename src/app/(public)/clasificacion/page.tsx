export const dynamic = 'force-dynamic';
import Image from "next/image";
import { prisma } from "@/lib/prisma";

const statusConfig = {
  "octavos": { label: "Octavos directo", color: "border-l-blue-500", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  "playoff-seed": { label: "Playoff (cabeza serie)", color: "border-l-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  "playoff": { label: "Playoff", color: "border-l-orange-500/60", badge: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  "eliminado": { label: "Eliminado", color: "border-l-white/5", badge: "bg-white/5 text-gray-500 border-white/10" },
};

function getStatus(pos: number) {
  if (pos <= 8) return "octavos";
  if (pos <= 16) return "playoff-seed";
  if (pos <= 24) return "playoff";
  return "eliminado";
}

export default async function ClasificacionPage() {
  const teams = await prisma.team.findMany({
    where: { season: "2025/26", group: { not: "0" } },
    select: { id: true, name: true, country: true, logoUrl: true },
  });

  const matches = await prisma.match.findMany({
    where: { phase: "FASE_LIGA", status: "PLAYED" },
    select: {
      homeTeamId: true, awayTeamId: true,
      homeGoals: true, awayGoals: true,
    },
  });

  // Calcular estadísticas
  type Stats = { id: string; name: string; country: string; logoUrl: string | null; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number; dg: number; pts: number };
  const statsMap: Record<string, Stats> = {};

  for (const team of teams) {
    statsMap[team.id] = { ...team, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 };
  }

  for (const match of matches) {
    const home = statsMap[match.homeTeamId];
    const away = statsMap[match.awayTeamId];
    if (!home || !away) continue;

    const hg = match.homeGoals ?? 0;
    const ag = match.awayGoals ?? 0;

    home.pj++; away.pj++;
    home.gf += hg; home.gc += ag;
    away.gf += ag; away.gc += hg;

    if (hg > ag) { home.pg++; home.pts += 3; away.pp++; }
    else if (hg === ag) { home.pe++; home.pts++; away.pe++; away.pts++; }
    else { away.pg++; away.pts += 3; home.pp++; }
  }

  const standings = Object.values(statsMap)
    .map(t => ({ ...t, dg: t.gf - t.gc }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf || a.name.localeCompare(b.name))
    .map((t, i) => ({ ...t, pos: i + 1, status: getStatus(i + 1) }));

  return (
    <main className="container mx-auto max-w-5xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-bebas text-5xl tracking-wider mb-1">Clasificación</h1>
        <p className="text-gray-500 text-sm">
          Fase de Liga · UEFA Champions League 2025/26 · {matches.length} partidos computados
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-8">
        {Object.entries(statusConfig).map(([key, val]) => (
          <div key={key} className={`flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-lg border ${val.badge}`}>
            {val.label}
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_3rem_2.5rem_3rem] gap-2 px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-white/5">
          <span>#</span>
          <span>Equipo</span>
          <span className="text-center">PJ</span>
          <span className="text-center">PG</span>
          <span className="text-center">PE</span>
          <span className="text-center">PP</span>
          <span className="text-center">GF</span>
          <span className="text-center">DG</span>
          <span className="text-center text-white">PTS</span>
        </div>

        {standings.map((team, i) => {
          const config = statusConfig[team.status as keyof typeof statusConfig];
          const isNewSection = i === 8 || i === 16 || i === 24;
          return (
            <div key={team.id}>
              {isNewSection && (
                <div className={`h-px w-full ${i === 8 ? "bg-blue-500/30" : i === 16 ? "bg-yellow-500/30" : "bg-white/5"}`} />
              )}
              <div className={`grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_3rem_2.5rem_3rem] gap-2 px-4 py-3 items-center text-sm border-b border-white/[0.03] last:border-0 hover:bg-white/[0.03] transition-colors border-l-2 ${config.color}`}>
                <span className={`font-bold text-xs ${team.pos <= 8 ? "text-blue-400" : team.pos <= 24 ? "text-gray-400" : "text-gray-600"}`}>{team.pos}</span>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                    {team.logoUrl ? (
                      <Image src={team.logoUrl} alt={team.name} width={28} height={28} className="object-contain w-full h-full" unoptimized />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        {team.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className={`font-semibold text-sm ${team.pos > 24 ? "text-gray-500" : "text-white"}`}>{team.name}</span>
                    <span className="text-gray-700 text-[10px] ml-2 hidden sm:inline">{team.country}</span>
                  </div>
                </div>
                <span className="text-center text-gray-500 text-xs">{team.pj}</span>
                <span className="text-center text-gray-500 text-xs">{team.pg}</span>
                <span className="text-center text-gray-500 text-xs">{team.pe}</span>
                <span className="text-center text-gray-500 text-xs">{team.pp}</span>
                <span className="text-center text-gray-500 text-xs">{team.gf}</span>
                <span className={`text-center font-semibold text-xs ${team.dg > 0 ? "text-green-400" : team.dg < 0 ? "text-red-400" : "text-gray-500"}`}>
                  {team.dg > 0 ? "+" : ""}{team.dg}
                </span>
                <span className={`text-center font-black text-base ${team.pos <= 8 ? "text-white" : team.pos <= 24 ? "text-gray-300" : "text-gray-600"}`}>{team.pts}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-700 mt-4 text-right">
        Calculado automáticamente desde los partidos de la BD · UCL 2025/26
      </p>
    </main>
  );
}
