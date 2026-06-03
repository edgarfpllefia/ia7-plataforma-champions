import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

const teamSchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  group: z.string().min(1),
  season: z.string().min(4),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const teams = await prisma.team.findMany({ orderBy: [{ group: "asc" }, { name: "asc" }] });
    return NextResponse.json(teams);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const data = teamSchema.parse(await req.json());
    const created = await prisma.team.create({ data: { ...data, logoUrl: data.logoUrl || null } });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Forbidden or invalid data" }, { status: 400 });
  }
}
