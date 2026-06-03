"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    setLoading(false);
    if (res.ok) {
      setIsError(false);
      setMessage("¡Cuenta creada! Redirigiendo...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const data = await res.json();
      setIsError(true);
      setMessage(data.error ?? "Error al registrarse");
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-bebas text-5xl tracking-wider mb-1">Crear cuenta</h1>
          <p className="text-gray-500 text-sm">Únete a Champions SaaS</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-7">
          <form action={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Nombre</label>
              <input name="name" placeholder="Tu nombre" required
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Email</label>
              <input name="email" type="email" placeholder="tu@email.com" required
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Contraseña</label>
              <input name="password" type="password" placeholder="Mínimo 8 caracteres" required
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            {message && <p className={`text-xs font-medium ${isError ? "text-red-400" : "text-green-400"}`}>{message}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 py-3 rounded-xl font-semibold text-sm transition-colors mt-2">
              {loading ? "Creando..." : "Crear cuenta"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-5">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
