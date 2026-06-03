import { NextResponse } from "next/server";
import { requireRole } from "@/lib/authz";
import { uploadImage } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const { id } = await params;
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "File required" }, { status: 400 });

    const key = `teams/${id}/logo-${Date.now()}.webp`;
    const logoUrl = await uploadImage(process.env.SUPABASE_BUCKET_TEAMS!, key, file);
    const updated = await prisma.team.update({ where: { id }, data: { logoUrl } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
}
