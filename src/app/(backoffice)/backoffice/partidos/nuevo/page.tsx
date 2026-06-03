"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Team = { id: string; name: string };

export default function NouPartitPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/teams").then((r) => r.json()).then(setTeams);
  }, []);

  async function onSubmit(formData: FormData) {
    setError("");
    const payload = {
      homeTeamId: formData.get("homeTeamId"),
      awayTeamId: formData.get("awayTeamId"),
      matchDate: formData.get("matchDate"),
      matchday: Number(formData.get("matchday")),
      status: formData.get("status"),
    };
    const res = await fetch("/api/backoffice/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/backoffice/partidos");
    } else {
      const data = await res.json();
      setError(data.error ?? "Error en crear el partit.");
    }
  }

  return (
    <main className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nou Partit</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeTeamId">Equip local</Label>
              <select id="homeTeamId" name="homeTeamId" className="w-full border rounded px-3 py-2 text-sm" required>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayTeamId">Equip visitant</Label>
              <select id="awayTeamId" name="awayTeamId" className="w-full border rounded px-3 py-2 text-sm" required>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchDate">Data del partit</Label>
              <Input id="matchDate" name="matchDate" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchday">Jornada</Label>
              <Input id="matchday" name="matchday" type="number" min={1} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estat</Label>
              <select id="status" name="status" className="w-full border rounded px-3 py-2 text-sm">
                <option value="SCHEDULED">Programat</option>
                <option value="PLAYED">Jugat</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Crear partit</Button>
          </form>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
