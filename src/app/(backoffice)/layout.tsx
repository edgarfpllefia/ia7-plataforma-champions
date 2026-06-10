import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !["EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen">
      {/* Barra de navegación del backoffice */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="container mx-auto max-w-7xl px-5 flex items-center gap-1 h-12">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 mr-3">Backoffice</span>
          <Link
            href="/backoffice/equipos"
            className="px-3 py-1.5 text-[12px] font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Equipos
          </Link>
          <Link
            href="/backoffice/partidos"
            className="px-3 py-1.5 text-[12px] font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Partidos
          </Link>
          {isAdmin && (
            <Link
              href="/backoffice/usuarios"
              className="px-3 py-1.5 text-[12px] font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Usuarios
            </Link>
          )}
          <Link
            href="/"
            className="ml-auto px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            ← Volver a la web
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
