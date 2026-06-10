export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import EditarEquipoClient from "./EditarEquipoClient";

export default async function EditarEquipoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !["EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }

  const { id } = await params;
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) notFound();

  return <EditarEquipoClient team={team} />;
}
