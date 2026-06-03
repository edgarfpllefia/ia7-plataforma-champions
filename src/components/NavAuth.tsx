"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-400 hidden sm:block">
          {session.user.name}
        </span>
        {(session.user.role === "ADMIN" || session.user.role === "EDITOR") && (
          <Link
            href="/backoffice/equipos"
            className="text-[12px] font-medium text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            Backoffice
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-[13px] font-semibold bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-1.5 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
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
