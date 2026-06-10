"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Team = { id: string; name: string };
type Match = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  matchday: number;
  phase: string;
  status: string;
  homeGoals: number | null;
  awayGoals: number | null;
  matchDate: Date;
};

const phases = ["FASE_LIGA", "OCTAVOS", "CUARTOS", "SEMIFINALES", "FINAL"];
const phaseLabel: Record<string, string> = {
  FASE_LIGA: "Fase de Liga",
  OCTAVOS: "Octavos de Final",
  CUARTOS: "Cuartos de Final",
  SEMIFINALES: "Semifinales",
  FINAL: "Final",
};

export default function EditarPartidoClient({ match, teams }: { match: Match; teams: Team[] }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const matchDateLocal = new Date(match.matchDate).toISOString().slice(0, 16);

  async function onSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const payload = {
      homeTeamId: formData.get("homeTeamId"),
      awayTeamId: formData.get("awayTeamId"),
      matchDate: formData.get("matchDate"),
      matchday: Number(formData.get("matchday")),
      phase: formData.get("phase"),
      status: formData.get("status"),
      homeGoals: formData.get("homeGoals") !== "" ? Number(formData.get("homeGoals")) : null,
      awayGoals: formData.get("awayGoals") !== "" ? Number(formData.get("awayGoals")) : null,
    };
    const res = await fetch(`/api/backoffice/matches/${match.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/backoffice/partidos");
      router.refresh();
    } else {
      setError("Error al actualizar. Comprueba que tienes permisos.");
    }
  }

  return (
    <main className="container mx-auto max-w-md px-5 py-10">
      <div className="mb-6">
        <h1 className="font-bebas text-4xl tracking-wider">Editar Partido</h1>
      </div>
      <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-7">
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Equipo local</label>
            <select name="homeTeamId" defaultValue={match.homeTeamId}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50">
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Equipo visitante</label>
            <select name="awayTeamId" defaultValue={match.awayTeamId}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50">
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Fecha</label>
            <input name="matchDate" type="datetime-local" defaultValue={matchDateLocal} required
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Jornada</label>
              <input name="matchday" type="number" min={1} defaultValue={match.matchday} required
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Fase</label>
              <select name="phase" defaultValue={match.phase}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50">
                {phases.map(p => <option key={p} value={p}>{phaseLabel[p]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Estado</label>
            <select name="status" defaultValue={match.status}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50">
              <option value="SCHEDULED">Programado</option>
              <option value="PLAYED">Jugado</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Goles local</label>
              <input name="homeGoals" type="number" min={0} defaultValue={match.homeGoals ?? ""}
                placeholder="-"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Goles visitante</label>
              <input name="awayGoals" type="number" min={0} defaultValue={match.awayGoals ?? ""}
                placeholder="-"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 py-3 rounded-xl font-semibold text-sm transition-colors">
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </main>
  );
}
