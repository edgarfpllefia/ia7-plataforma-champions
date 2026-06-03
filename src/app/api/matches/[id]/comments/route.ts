import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authz";

const schema = z.object({ content: z.string().min(1).max(500) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const body = schema.parse(await req.json());
    const created = await prisma.comment.create({
      data: { content: body.content, matchId: params.id, authorId: session.user.id },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized or invalid data" }, { status: 400 });
  }
}
