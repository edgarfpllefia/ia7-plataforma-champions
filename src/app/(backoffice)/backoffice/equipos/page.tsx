import Link from "next/link";

export default async function BackofficeEquiposPage() {
  const res = await fetch("http://localhost:3000/api/backoffice/teams", { cache: "no-store" });
  const teams = res.ok ? await res.json() : [];

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestión de Equipos</h1>
        <Link href="/backoffice/equipos/nuevo" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          + Nuevo equipo
        </Link>
      </div>
      <div className="grid gap-4">
        {teams.map((team: { id: string; name: string; country: string; group: string; season: string }) => (
          <div key={team.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                {team.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold">{team.name}</h3>
                <p className="text-sm text-gray-400">{team.country} · Grupo {team.group} · {team.season}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
