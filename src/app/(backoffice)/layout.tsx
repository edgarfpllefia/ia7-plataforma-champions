import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !["EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  const navItems = [
    { href: "/backoffice/equipos", label: "Equipos", icon: "🛡️" },
    { href: "/backoffice/partidos", label: "Partidos", icon: "⚽" },
    ...(isAdmin ? [{ href: "/backoffice/usuarios", label: "Usuarios", icon: "👥" }] : []),
  ];

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-white/5 bg-white/[0.02] flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b border-white/5">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase text-gray-600">Backoffice</p>
          <p className="text-sm font-semibold text-white mt-1">{session.user.name}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
            isAdmin
              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          }`}>
            {session.user.role}
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>←</span>
            <span>Volver a la web</span>
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
