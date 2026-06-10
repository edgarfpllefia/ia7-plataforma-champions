export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function BackofficeEquiposPage() {
  const session = await auth();
  if (!session?.user || !["EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const teams = await prisma.team.findMany({
    where: { group: { not: "0" } },
    orderBy: [{ group: "asc" }, { name: "asc" }],
  });

  return (
    <main className="container mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bebas text-4xl tracking-wider">Gestión de Equipos</h1>
          <p className="text-gray-500 text-sm">{teams.length} equipos</p>
        </div>
        <Link
          href="/backoffice/equipos/nuevo"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          + Nuevo equipo
        </Link>
      </div>
      <div className="grid gap-2">
        {teams.map((team) => (
          <div key={team.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              {team.logoUrl ? (
                <Image src={team.logoUrl} alt={team.name} width={40} height={40} className="object-contain" unoptimized />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                  {team.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{team.name}</p>
              <p className="text-gray-500 text-xs">{team.country} · Bombo {team.group} · {team.season}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/backoffice/equipos/${team.id}/editar`}
                className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
              >
                Editar
              </Link>
              <DeleteTeamButton id={team.id} name={team.name} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function DeleteTeamButton({ id, name }: { id: string; name: string }) {
  return (
    <form action={async () => {
      "use server";
      const { prisma: db } = await import("@/lib/prisma");
      await db.team.delete({ where: { id } });
    }}>
      <button
        type="submit"
        onClick={(e) => { if (!confirm(`¿Borrar ${name}?`)) e.preventDefault(); }}
        className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
      >
        Borrar
      </button>
    </form>
  );
}
