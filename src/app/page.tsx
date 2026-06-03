export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

const phaseLabel: Record<string, string> = {
  FASE_LIGA: "Fase Liga",
  OCTAVOS: "Octavos",
  CUARTOS: "Cuartos",
  SEMIFINALES: "Semis",
  FINAL: "Final",
};

export default async function HomePage() {
  const teams = await prisma.team.findMany({
    where: { group: { in: ["1", "2"] } },
    orderBy: [{ group: "asc" }, { name: "asc" }],
    take: 8,
  });

  const recentMatches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    where: { status: "PLAYED", phase: { not: "FASE_LIGA" } },
    orderBy: { matchDate: "desc" },
    take: 4,
  });

  const upcomingMatches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    where: { status: "SCHEDULED" },
    orderBy: { matchDate: "asc" },
    take: 3,
  });

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-blue-400">Temporada 2025/26</span>
            </div>
            <h1 className="font-bebas text-[clamp(52px,10vw,100px)] leading-[0.9] tracking-[0.02em] mb-6">
              <span className="block text-white">UEFA</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400">Champions</span>
              <span className="block text-white/80">League</span>
            </h1>
            <p className="text-gray-400 text-base font-light leading-relaxed mb-10 max-w-lg">
              Sigue los últimos partidos, resultados y la historia de la UEFA Champions League. <span className="text-white/60">PSG bicampeón de Europa.</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/partidos" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98]">
                <span>🏆</span> Ver partidos
              </Link>
              <Link href="/clasificacion" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
                Ver clasificación
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EQUIPOS ===== */}
      <section className="container mx-auto max-w-7xl px-5 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bebas text-2xl tracking-wider text-white">Equipos destacados</h2>
            <p className="text-gray-600 text-xs mt-0.5">Bombo 1 — Los mejores del continente</p>
          </div>
          <Link href="/equipos" className="text-[12px] font-semibold text-blue-400 hover:text-blue-300 tracking-wide uppercase transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {teams.map((team) => (
            <div key={team.id} className="group bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/[0.07] hover:border-white/10 transition-all duration-200 cursor-pointer hover:scale-[1.03]">
              <div className="w-11 h-11 flex items-center justify-center">
                {team.logoUrl ? (
                  <Image src={team.logoUrl} alt={team.name} width={44} height={44} className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-200" unoptimized />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bebas text-xl">{team.name.charAt(0)}</div>
                )}
              </div>
              <span className="text-[11px] text-center font-semibold text-gray-300 leading-tight tracking-wide">{team.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== RESULTADOS + PRÓXIMOS ===== */}
      <section className="container mx-auto max-w-7xl px-5 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Últimos resultados */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bebas text-2xl tracking-wider">Últimos resultados</h2>
                <p className="text-gray-600 text-xs mt-0.5">Fase eliminatoria</p>
              </div>
              <Link href="/resultados" className="text-[12px] font-semibold text-blue-400 hover:text-blue-300 tracking-wide uppercase transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-2">
              {recentMatches.map((match) => (
                <Link key={match.id} href={`/partidos/${match.id}`}>
                  <div className="group bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.06] hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-600">{phaseLabel[match.phase] ?? match.phase}</span>
                      <span className="text-[10px] font-semibold text-green-500 tracking-wide">Finalizado</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-sm font-semibold text-right leading-tight hidden sm:block">{match.homeTeam.name}</span>
                        {match.homeTeam.logoUrl && (
                          <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={28} height={28} className="object-contain flex-shrink-0" unoptimized />
                        )}
                      </div>
                      <div className="bg-white/5 rounded-lg px-3 py-1.5 min-w-[72px] text-center flex-shrink-0">
                        <span className="font-bebas text-2xl tracking-wider">{match.homeGoals} - {match.awayGoals}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        {match.awayTeam.logoUrl && (
                          <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={28} height={28} className="object-contain flex-shrink-0" unoptimized />
                        )}
                        <span className="text-sm font-semibold leading-tight hidden sm:block">{match.awayTeam.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Próximos partidos */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bebas text-2xl tracking-wider">Próximos</h2>
                <p className="text-gray-600 text-xs mt-0.5">Partidos pendientes</p>
              </div>
              <Link href="/partidos" className="text-[12px] font-semibold text-blue-400 hover:text-blue-300 tracking-wide uppercase transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-2">
              {upcomingMatches.map((match) => (
                <Link key={match.id} href={`/partidos/${match.id}`}>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.06] transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-600">{phaseLabel[match.phase] ?? match.phase}</span>
                      <span className="text-[10px] font-semibold text-blue-400">
                        {new Date(match.matchDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-1.5">
                        {match.homeTeam.logoUrl && (
                          <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={32} height={32} className="object-contain" unoptimized />
                        )}
                        <span className="text-[11px] font-semibold text-center leading-tight">{match.homeTeam.name.split(" ")[0]}</span>
                      </div>
                      <span className="font-bebas text-3xl text-gray-600 tracking-wider">VS</span>
                      <div className="flex flex-col items-center gap-1.5">
                        {match.awayTeam.logoUrl && (
                          <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={32} height={32} className="object-contain" unoptimized />
                        )}
                        <span className="text-[11px] font-semibold text-center leading-tight">{match.awayTeam.name.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {upcomingMatches.length === 0 && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
                  <p className="text-gray-600 text-sm">No hay partidos programados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER STATS ===== */}
      <section className="border-t border-white/5">
        <div className="container mx-auto max-w-7xl px-5 py-10 grid sm:grid-cols-3 gap-4">
          {[
            { icon: "📊", title: "Estadísticas en tiempo real", desc: "Datos actualizados de la competición" },
            { icon: "⭐", title: "Cobertura completa", desc: "Todas las fases, todas las jornadas" },
            { icon: "📱", title: "Siempre disponible", desc: "Sigue la Champions donde estés" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className="font-semibold text-sm text-white mb-0.5">{title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
