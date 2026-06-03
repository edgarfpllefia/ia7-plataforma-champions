"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AvatarUploader() {
  async function upload(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/users/me/avatar", { method: "POST", body: form });
    if (res.ok) alert("Avatar actualitzat!");
    else alert("Error en pujar l'avatar.");
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Canviar avatar</Label>
      <Input
        id="avatar"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
    </div>
  );
}
