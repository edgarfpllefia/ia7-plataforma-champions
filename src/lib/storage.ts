import { createClient } from "@supabase/supabase-js";

export const storage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

export function validateImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("INVALID_IMAGE_TYPE");
  if (file.size > MAX_SIZE_BYTES) throw new Error("IMAGE_TOO_LARGE");
}

export async function uploadImage(bucket: string, key: string, file: File) {
  validateImage(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await storage.storage.from(bucket).upload(key, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw error;
  return storage.storage.from(bucket).getPublicUrl(key).data.publicUrl;
}
