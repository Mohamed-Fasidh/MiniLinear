"use client";

import { Issue } from "@/types";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { use } from "react";

export default function ProjectPage(props : any) {
  // 💡 Correct param access
  const {id:project_id} = use(props.params as Promise<{ id: string }>)

  const [tasks, setTasks] = useState<Issue[]>([]);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");

  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const db = supabaseBrowser();

  async function fetchTasks() {
    const { data } = await db
      .from("issues")
      .select("*")
      .eq("project_id", project_id)
      .order("created_at", { ascending: true });

    setTasks(data || []);
  }

  async function addTask() {
    if (!title.trim()) return;
    await db.from("issues").insert({ project_id, title, status: "todo" });
    setTitle("");
    fetchTasks();
  }

  async function updateStatus(id: string, status: string) {
    await db.from("issues").update({ status }).eq("id", id);
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await db.from("issues").delete().eq("id", id);
    fetchTasks();
  }

  async function saveEdit(id: string) {
    await db
      .from("issues")
      .update({ title: editTitle, description: editDesc })
      .eq("id", id);

    setEditing(null);
    setEditTitle("");
    setEditDesc("");
    fetchTasks();
  }

  async function generateTasks() {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // 💡 required!
      body: JSON.stringify({ prompt, project_id }),
    });

    await res.json();
    setPrompt("");
    fetchTasks();
  }

  useEffect(() => {
    if (project_id) fetchTasks();
  }, [project_id]);

  const columns: Record<string, Issue[]> = {
    todo: [],
    doing: [],
    done: [],
    blocked: [],
  };

  tasks.forEach((t) => {
    columns[t.status] = columns[t.status] || [];
    columns[t.status].push(t);
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Project Tasks</h1>

      {/* Add task */}
      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-2 w-80"
          placeholder="New task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask} className="border px-4 py-2 hover:bg-gray-100">
          Add
        </button>
      </div>

      {/* AI */}
      <textarea
        className="border w-80 p-2 h-24 mb-2"
        placeholder="Ask AI: 'Break onboarding flow into tasks'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateTasks} className="border px-4 py-2 hover:bg-gray-100">
        AI Generate
      </button>

      {/* Kanban */}
      <div className="grid grid-cols-4 gap-4 mt-10">
        {Object.entries(columns).map(([status, list]) => (
          <div key={status} className="border p-4 rounded bg-gray-50">
            <h2 className="font-semibold capitalize mb-3">{status}</h2>

            {list.map((t) =>
              editing === t.id ? (
                <div key={t.id} className="border bg-white p-2 mb-2 rounded">
                  <input
                    className="border p-1 w-full mb-1"
                    value={editTitle}
                    placeholder="Edit title"
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border p-1 w-full mb-1"
                    value={editDesc}
                    placeholder="Edit description"
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                  <button className="mr-2" onClick={() => saveEdit(t.id as string)}>
                    💾
                  </button>
                  <button
                    onClick={() => {
                      setEditing(null);
                      setEditTitle("");
                      setEditDesc("");
                    }}
                  >
                    ❌
                  </button>
                </div>
              ) : (
                <div key={t.id} className="border bg-white p-2 mb-2 rounded">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.description || "-"}</p>

                  <div className="flex gap-1 text-xs mt-2">
                    <button
                      onClick={() => {
                        setEditing(t.id!);
                        setEditTitle(t.title);
                        setEditDesc(t.description ?? "");
                      }}
                    >
                      ✏️
                    </button>
                    <button onClick={() => updateStatus(t.id!, "doing")}>➡️</button>
                    <button onClick={() => updateStatus(t.id!, "done")}>✔️</button>
                    <button onClick={() => updateStatus(t.id!, "blocked")}>⛔</button>
                    <button onClick={() => deleteTask(t.id!)}>🗑️</button>
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
