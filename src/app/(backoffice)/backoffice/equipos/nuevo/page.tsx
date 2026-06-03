"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoEquipoPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setError("");
    const payload = {
      name: formData.get("name"),
      country: formData.get("country"),
      group: formData.get("group"),
      season: formData.get("season"),
    };
    const res = await fetch("/api/backoffice/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/backoffice/equipos");
    } else {
      setError("Error al crear el equipo. Comprueba que tienes permisos.");
    }
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Nuevo Equipo</h1>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
            <input name="name" placeholder="FC Barcelona" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
            <input name="country" placeholder="España" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Grupo</label>
            <input name="group" placeholder="A" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Temporada</label>
            <input name="season" placeholder="2025/26" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-semibold transition-colors">
            Crear equipo
          </button>
        </form>
      </div>
    </main>
  );
}
