import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

const updateMatch = z.object({
  homeTeamId: z.string().optional(),
  awayTeamId: z.string().optional(),
  matchDate: z.string().optional(),
  matchday: z.number().int().positive().optional(),
  phase: z.enum(["FASE_LIGA", "OCTAVOS", "CUARTOS", "SEMIFINALES", "FINAL"]).optional(),
  status: z.enum(["SCHEDULED", "PLAYED"]).optional(),
  homeGoals: z.number().int().min(0).nullable().optional(),
  awayGoals: z.number().int().min(0).nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const { id } = await params;
    const body = await req.json();
    const data = updateMatch.parse(body);
    const updated = await prisma.match.update({
      where: { id },
      data: {
        ...data,
        matchDate: data.matchDate ? new Date(data.matchDate) : undefined,
      },
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
    await prisma.match.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
