"use client";

import { useState } from "react";

export function NewCommentForm({ matchId }: { matchId: string }) {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function submitComment() {
    if (!content.trim()) return;
    const res = await fetch(`/api/matches/${matchId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setContent("");
      setIsError(false);
      setMessage("¡Comentario publicado!");
      setTimeout(() => setMessage(""), 2500);
    } else {
      setIsError(true);
      setMessage("Debes iniciar sesión para comentar.");
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
      <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Añadir comentario</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu comentario..."
        rows={3}
        className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 resize-none transition-colors"
      />
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={submitComment}
          disabled={!content.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          Publicar
        </button>
        {message && (
          <p className={`text-xs font-medium ${isError ? "text-red-400" : "text-green-400"}`}>{message}</p>
        )}
      </div>
    </div>
  );
}
