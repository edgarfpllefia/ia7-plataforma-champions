"use client";

import { useRouter } from "next/navigation";

export default function DeleteMatchButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Borrar este partido?")) return;
    const res = await fetch(`/api/backoffice/matches/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Error al borrar el partido");
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
