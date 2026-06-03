"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function NavAuth() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (status === "loading") return (
    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
  );

  if (session?.user) {
    const initials = session.user.name
      ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";

    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-colors flex-shrink-0">
            {session.user.image ? (
              <Image src={session.user.image} alt={session.user.name ?? ""} width={32} height={32} className="object-cover w-full h-full" unoptimized />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-[11px] font-bold text-white">
                {initials}
              </div>
            )}
          </div>
          <span className="text-[12px] text-gray-400 hidden sm:block group-hover:text-white transition-colors">
            {session.user.name?.split(" ")[0]}
          </span>
          <svg viewBox="0 0 24 24" className={`w-3 h-3 fill-gray-600 transition-transform ${menuOpen ? "rotate-180" : ""}`}>
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0d1225] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{session.user.email}</p>
                <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">{session.user.role}</span>
              </div>
              <div className="py-1">
                {(session.user.role === "ADMIN" || session.user.role === "EDITOR") && (
                  <Link
                    href="/backoffice/equipos"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    ⚙️ Backoffice
                  </Link>
                )}
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/backoffice/usuarios"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    👥 Usuarios
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-[13px] text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                >
                  → Cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-[13px] font-medium text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
      >
        Entrar
      </Link>
      <Link
        href="/register"
        className="text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg transition-colors"
      >
        Registro
      </Link>
    </div>
  );
}
