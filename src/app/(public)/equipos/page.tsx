export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Image from "next/image";

const bomboConfig: Record<string, { label: string; accent: string; border: string }> = {
  "1": { label: "Bombo 1", accent: "text-yellow-400", border: "border-yellow-500/20" },
  "2": { label: "Bombo 2", accent: "text-blue-400", border: "border-blue-500/20" },
  "3": { label: "Bombo 3", accent: "text-purple-400", border: "border-purple-500/20" },
  "4": { label: "Bombo 4", accent: "text-gray-400", border: "border-gray-500/20" },
};

export default async function EquiposPage() {
  const teams = await prisma.team.findMany({
    where: { group: { not: "0" } },
    orderBy: [{ group: "asc" }, { name: "asc" }],
  });

  const byBombo = teams.reduce((acc, team) => {
    if (!acc[team.group]) acc[team.group] = [];
    acc[team.group].push(team);
    return acc;
  }, {} as Record<string, typeof teams>);

  return (
    <main className="container mx-auto max-w-7xl px-5 py-12">
      <div className="mb-10">
        <h1 className="font-bebas text-5xl tracking-wider mb-1">Equipos</h1>
        <p className="text-gray-500 text-sm">{teams.length} equipos · UEFA Champions League 2025/26</p>
      </div>

      {Object.entries(byBombo).map(([bombo, bomboTeams]) => {
        const config = bomboConfig[bombo] ?? bomboConfig["4"];
        return (
          <div key={bombo} className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <span className={`text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border bg-white/3 ${config.accent} ${config.border}`}>
                {config.label}
              </span>
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-xs text-gray-700">{bomboTeams.length} equipos</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {bomboTeams.map((team) => (
                <div key={team.id} className="group bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.06] hover:border-white/10 transition-all flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                    {team.logoUrl ? (
                      <Image src={team.logoUrl} alt={team.name} width={56} height={56} className="object-contain drop-shadow group-hover:scale-110 transition-transform duration-200" unoptimized />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bebas text-2xl">{team.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{team.name}</h3>
                    <p className="text-gray-500 text-xs">{team.country}</p>
                    <span className={`text-[10px] font-semibold tracking-wide ${config.accent}`}>{config.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}
