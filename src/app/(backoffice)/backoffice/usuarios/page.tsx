"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/backoffice/users")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError("No tens permisos per veure aquesta pàgina.");
        }
      });
  }, []);

  async function changeRole(id: string, role: string) {
    const res = await fetch(`/api/backoffice/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      setMessage("Rol actualitzat!");
      setTimeout(() => setMessage(""), 2000);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    const res = await fetch(`/api/backoffice/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !active } : u)));
    }
  }

  if (error) {
    return (
      <main className="container mx-auto max-w-3xl py-8">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-semibold mb-6">Gestió d&apos;Usuaris</h1>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{user.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={user.active ? "default" : "secondary"}>
                    {user.active ? "Actiu" : "Inactiu"}
                  </Badge>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => changeRole(user.id, "USER")}>USER</Button>
                <Button size="sm" variant="outline" onClick={() => changeRole(user.id, "EDITOR")}>EDITOR</Button>
                <Button size="sm" variant="outline" onClick={() => changeRole(user.id, "ADMIN")}>ADMIN</Button>
                <Button
                  size="sm"
                  variant={user.active ? "destructive" : "default"}
                  onClick={() => toggleActive(user.id, user.active)}
                >
                  {user.active ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground">Carregant usuaris...</p>
        )}
      </div>
    </main>
  );
}
