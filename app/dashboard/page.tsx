"use client";

import { useEffect, useState } from "react";
import { addProject, getProjects, deleteProject } from "@/lib/supabaseActions";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState("");
  const router = useRouter();

  async function fetchProjects() {
    try {
      const list = await getProjects();
      setProjects(list);
    } catch (e) {
      console.error(e);
    }
  }

  async function addNew() {
    if (!newProject.trim()) return;
    await addProject(newProject);
    setNewProject("");
    fetchProjects();
  }

  async function removeProject(id: string) {
    if (!confirm("Delete project? All tasks inside will be removed.")) return;
    await deleteProject(id);
    fetchProjects();
  }

  async function logout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Projects</h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>

      {/* Add Project */}
      <div className="flex gap-2">
        <input
          className="border px-3 py-2 rounded-md flex-1"
          placeholder="New project name..."
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <button
          onClick={addNew}
          className="border px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Add
        </button>
      </div>

      {/* Show project list */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center border rounded px-4 py-3 hover:bg-gray-50"
          >
            <Link
              href={`/dashboard/${p.id}`}
              className="text-lg font-medium hover:text-blue-600"
            >
              {p.name}
            </Link>

            <button
              onClick={() => removeProject(p.id)}
              className="text-red-500 hover:text-red-700"
            >
              🗑
            </button>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-gray-500 pt-4">
            No projects yet — add one above 
          </p>
        )}
      </div>
    </div>
  );
}
