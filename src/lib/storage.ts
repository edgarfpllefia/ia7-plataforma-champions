import { createClient } from "@supabase/supabase-js";

export const storage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Tipo de archivo no permitido: ${file.type}. Usa JPG, PNG, WEBP o SVG.`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("El archivo es demasiado grande. Máximo 5MB.");
  }
}

export async function uploadImage(bucket: string, key: string, file: File) {
  validateImage(file);

  if (!bucket) throw new Error("Bucket no configurado");

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await storage.storage.from(bucket).upload(key, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw new Error(`Supabase error: ${error.message}`);
  return storage.storage.from(bucket).getPublicUrl(key).data.publicUrl;
}
