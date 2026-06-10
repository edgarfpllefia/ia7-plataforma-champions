"use client";

import { useState } from "react";

type User = { id: string; name: string; email: string; role: string; active: boolean };

export default function AdminUsuariosClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [message, setMessage] = useState("");

  async function changeRole(id: string, role: string) {
    const res = await fetch(`/api/backoffice/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      setMessage("Rol actualizado");
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
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !active } : u));
    }
  }

  return (
    <main className="container mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <h1 className="font-bebas text-4xl tracking-wider">Gestión de Usuarios</h1>
        <p className="text-gray-500 text-sm">{users.length} usuarios registrados</p>
      </div>
      {message && <p className="mb-4 text-sm text-green-400 font-medium">{message}</p>}
      <div className="grid gap-2">
        {users.map((user) => (
          <div key={user.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                  user.active
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {user.active ? "Activo" : "Inactivo"}
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg border bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["USER", "EDITOR", "ADMIN"].map(r => (
                <button
                  key={r}
                  onClick={() => changeRole(user.id, r)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    user.role === r
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-white/3 border-white/10 text-gray-400 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {r}
                </button>
              ))}
              <button
                onClick={() => toggleActive(user.id, user.active)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ml-auto ${
                  user.active
                    ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    : "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                }`}
              >
                {user.active ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
