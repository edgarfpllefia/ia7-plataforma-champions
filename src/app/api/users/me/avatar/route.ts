import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authz";
import { uploadImage } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "File required" }, { status: 400 });

    const key = `users/${session.user.id}/avatar-${Date.now()}.webp`;
    const avatarUrl = await uploadImage(process.env.SUPABASE_BUCKET_AVATARS!, key, file);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
}
