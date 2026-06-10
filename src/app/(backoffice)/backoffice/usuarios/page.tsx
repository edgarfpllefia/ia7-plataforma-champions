export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminUsuariosClient from "./AdminUsuariosClient";

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true },
    orderBy: { createdAt: "desc" },
  });

  return <AdminUsuariosClient initialUsers={users} />;
}
