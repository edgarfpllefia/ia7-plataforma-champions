import { NextResponse } from "next/server";
import { requireRole } from "@/lib/authz";
import { uploadImage } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "File required" }, { status: 400 });

    const key = `matches/${params.id}/image-${Date.now()}.webp`;
    const imageUrl = await uploadImage(process.env.SUPABASE_BUCKET_MATCHES!, key, file);
    const updated = await prisma.match.update({ where: { id: params.id }, data: { imageUrl } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
}
