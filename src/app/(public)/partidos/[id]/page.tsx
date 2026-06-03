export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import { NewCommentForm } from "@/components/comments/NewCommentForm";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

const phaseLabel: Record<string, string> = {
  FASE_LIGA: "Fase de Liga",
  OCTAVOS: "Octavos de Final",
  CUARTOS: "Cuartos de Final",
  SEMIFINALES: "Semifinales",
  FINAL: "Final · Budapest",
};

export default async function PartidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      comments: {
        where: { deletedAt: null },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!match) notFound();

  return (
    <main className="container mx-auto max-w-3xl px-5 py-12">
      {/* Match card */}
      <div className="relative bg-white/[0.03] border border-white/8 rounded-3xl p-8 mb-8 overflow-hidden">
        {/* Ambient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-indigo-900/10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">
              {phaseLabel[match.phase] ?? match.phase}
              {match.phase === "FASE_LIGA" && ` · Jornada ${match.matchday}`}
            </span>
            <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${match.status === "PLAYED" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
              {match.status === "PLAYED" ? "✓ Finalizado" : "🕐 Programado"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-20 h-20 flex items-center justify-center">
                {match.homeTeam.logoUrl ? (
                  <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={80} height={80} className="object-contain drop-shadow-xl" unoptimized />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center font-bebas text-3xl">{match.homeTeam.name.charAt(0)}</div>
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-base leading-tight">{match.homeTeam.name}</p>
                <p className="text-gray-600 text-xs">{match.homeTeam.country}</p>
              </div>
            </div>

            {/* Score */}
            <div className="text-center flex-shrink-0 px-4">
              {match.status === "PLAYED" ? (
                <>
                  <div className="font-bebas text-7xl tracking-wider leading-none text-white">
                    {match.homeGoals} <span className="text-gray-600">-</span> {match.awayGoals}
                  </div>
                  <p className="text-gray-600 text-[10px] tracking-widest uppercase mt-1">Resultado final</p>
                </>
              ) : (
                <>
                  <div className="font-bebas text-5xl text-gray-600 tracking-wider">VS</div>
                  <p className="text-blue-400 text-xs mt-1">
                    {new Date(match.matchDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-20 h-20 flex items-center justify-center">
                {match.awayTeam.logoUrl ? (
                  <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={80} height={80} className="object-contain drop-shadow-xl" unoptimized />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center font-bebas text-3xl">{match.awayTeam.name.charAt(0)}</div>
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-base leading-tight">{match.awayTeam.name}</p>
                <p className="text-gray-600 text-xs">{match.awayTeam.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comentarios */}
      <div>
        <h2 className="font-bebas text-2xl tracking-wider mb-4">
          Comentarios <span className="text-gray-600 text-xl">({match.comments.length})</span>
        </h2>
        <div className="space-y-2.5 mb-6">
          {match.comments.map((comment) => (
            <div key={comment.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{comment.author.name}</span>
                <span className="text-xs text-gray-600 ml-auto">
                  {new Date(comment.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pl-9">{comment.content}</p>
            </div>
          ))}
          {match.comments.length === 0 && (
            <p className="text-gray-600 text-sm py-6 text-center">No hay comentarios todavía. ¡Sé el primero!</p>
          )}
        </div>
        <NewCommentForm matchId={match.id} />
      </div>
    </main>
  );
}
