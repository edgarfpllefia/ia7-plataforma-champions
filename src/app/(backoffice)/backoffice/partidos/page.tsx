import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Match = {
  id: string;
  matchday: number;
  status: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeTeam: { name: string };
  awayTeam: { name: string };
};

export default async function BackofficePartidosPage() {
  const res = await fetch("http://localhost:3000/api/backoffice/matches", { cache: "no-store" });
  const matches: Match[] = res.ok ? await res.json() : [];

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Gestió de Partits</h1>
        <Link href="/backoffice/partidos/nuevo">
          <Button>Nou partit</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </CardTitle>
                <Badge variant={match.status === "PLAYED" ? "default" : "secondary"}>
                  {match.status === "PLAYED" ? "Jugat" : "Programat"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Jornada {match.matchday}</p>
              {match.status === "PLAYED" && (
                <p className="font-bold mt-1">{match.homeGoals} - {match.awayGoals}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
