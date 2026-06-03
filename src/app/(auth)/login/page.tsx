"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError("Email o contraseña incorrectos");
    else router.push("/equipos");
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-bebas text-5xl tracking-wider mb-1">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm">Entra a tu cuenta de Champions SaaS</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-7">
          <form action={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Email</label>
              <input name="email" type="email" placeholder="tu@email.com" required
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">Contraseña</label>
              <input name="password" type="password" placeholder="••••••••" required
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 py-3 rounded-xl font-semibold text-sm transition-colors mt-2">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-5">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Regístrate</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
