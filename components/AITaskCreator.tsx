"use client";
import { useState } from "react";

export default function AITaskCreator({ projectId }: any) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAI() {
    setLoading(true);
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ text, projectId }),
    });
    await res.json();
    window.location.reload();
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded p-3"
        placeholder="Describe work... (ex: fix bugs, build UI, write docs)"
      />
      <button
        disabled={loading}
        onClick={runAI}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking…" : "Generate Tasks with AI"}
      </button>
    </div>
  );
}
