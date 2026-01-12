"use client";
import { useState } from "react";
import { addIssue, getIssues, addProject, getProjects } from "@/lib/supabaseActions";

export default function AITaskCreator({ projectId }: any) {
  const [input, setInput] = useState("");

  async function generate() {
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ query: input }),
    });
    const tasks: string[] = await res.json();

    for (const t of tasks) await addIssue(projectId, t);
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        className="border rounded w-full p-2"
        placeholder="Fix login bug, add API, write tests..."
      />
      <button onClick={generate} className="bg-purple-600 text-white px-4 py-1 rounded">
        Generate Tasks with AI
      </button>
    </div>
  );
}
