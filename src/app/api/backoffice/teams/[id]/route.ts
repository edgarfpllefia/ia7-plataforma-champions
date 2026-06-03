import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

const updateTeam = z.object({
  name: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  group: z.string().min(1).optional(),
  season: z.string().min(4).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const { id } = await params;
    const data = updateTeam.parse(await req.json());
    const updated = await prisma.team.update({
      where: { id },
      data: { ...data, logoUrl: data.logoUrl === "" ? null : data.logoUrl },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const { id } = await params;
    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
