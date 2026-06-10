"use client";

import { useRouter } from "next/navigation";

export default function DeleteTeamButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Borrar ${name}?`)) return;
    const res = await fetch(`/api/backoffice/teams/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Error al borrar el equipo");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
    >
      Borrar
    </button>
  );
}
