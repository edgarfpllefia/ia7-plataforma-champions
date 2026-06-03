import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

const matchSchema = z.object({
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  matchDate: z.string(),
  matchday: z.number().int().positive(),
  status: z.enum(["SCHEDULED", "PLAYED"]).optional(),
  homeGoals: z.number().int().min(0).optional().nullable(),
  awayGoals: z.number().int().min(0).optional().nullable(),
});

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const matches = await prisma.match.findMany({
      include: { homeTeam: true, awayTeam: true },
      orderBy: { matchDate: "desc" },
    });
    return NextResponse.json(matches);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const data = matchSchema.parse(await req.json());
    if (data.homeTeamId === data.awayTeamId) {
      return NextResponse.json({ error: "Home and away teams must be different" }, { status: 400 });
    }
    const created = await prisma.match.create({
      data: { ...data, matchDate: new Date(data.matchDate) },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Forbidden or invalid data" }, { status: 400 });
  }
}
