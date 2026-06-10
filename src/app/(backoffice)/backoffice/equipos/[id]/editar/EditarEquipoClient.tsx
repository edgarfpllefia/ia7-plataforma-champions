"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Team = {
  id: string;
  name: string;
  country: string;
  group: string;
  season: string;
  logoUrl: string | null;
};

export default function EditarEquipoClient({ team }: { team: Team }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(team.logoUrl ?? "");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const payload = {
      name: formData.get("name"),
      country: formData.get("country"),
      group: formData.get("group"),
      season: formData.get("season"),
      logoUrl: currentLogoUrl || "",
    };
    const res = await fetch(`/api/backoffice/teams/${team.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/backoffice/equipos");
      router.refresh();
    } else {
      setError("Error al actualizar. Comprueba que tienes permisos.");
    }
  }

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    setSuccessMsg("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/backoffice/teams/${team.id}/logo`, {
      method: "POST",
      body: form,
    });
    setLogoUploading(false);
    if (res.ok) {
      const data = await res.json();
      setCurrentLogoUrl(data.logoUrl);
      setSuccessMsg("✓ Logo subido correctamente");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(`Error al subir el logo: ${data.error ?? "Error desconocido"}`);
    }
  }

  return (
    <main className="container mx-auto max-w-md px-5 py-10">
      <div className="mb-6">
        <h1 className="font-bebas text-4xl tracking-wider">Editar Equipo</h1>
        <p className="text-gray-500 text-sm">{team.name}</p>
      </div>
      <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-7 space-y-6">

        {/* Preview logo actual */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-xl border border-white/8">
            {currentLogoUrl ? (
              <Image src={currentLogoUrl} alt={team.name} width={56} height={56} className="object-contain" unoptimized />
            ) : (
              <span className="text-gray-600 text-xs text-center">Sin logo</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{team.name}</p>
            {currentLogoUrl && (
              <p className="text-[10px] text-gray-600 truncate max-w-[200px]">{currentLogoUrl}</p>
            )}
          </div>
        </div>

        {/* Upload logo */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">
            Subir logo a Supabase
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
            disabled={logoUploading}
            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white file:mr-3 file:bg-blue-600 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500 cursor-pointer disabled:opacity-60"
          />
          {logoUploading && <p className="text-xs text-blue-400 mt-2">Subiendo...</p>}
          {successMsg && <p className="text-xs text-green-400 mt-2">{successMsg}</p>}
        </div>

        {/* Formulario datos */}
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Nombre</label>
            <input name="name" defaultValue={team.name} required
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">País</label>
            <input name="country" defaultValue={team.country} required
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Bombo</label>
            <select name="group" defaultValue={team.group}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors">
              <option value="1">Bombo 1</option>
              <option value="2">Bombo 2</option>
              <option value="3">Bombo 3</option>
              <option value="4">Bombo 4</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Temporada</label>
            <input name="season" defaultValue={team.season} required
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">O pega una URL de logo</label>
            <input
              value={currentLogoUrl}
              onChange={(e) => setCurrentLogoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
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
