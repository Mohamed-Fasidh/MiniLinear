"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

// ============= PROJECTS ==================
export async function getProjects() {
  const db = supabaseBrowser();
  const { data, error } = await db
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addProject(name: string) {
  const db = supabaseBrowser();

  // get user
  const { data: { user } } = await db.auth.getUser();

  await db.from("projects").insert({
    name,
    user_id: user?.id,
    created_by:user?.id,
  });
}

export async function deleteProject(project_id: string) {
  const db = supabaseBrowser();

  // delete issues
  await db.from("issues").delete().eq("project_id", project_id);

  // delete main project
  return  await db.from("projects").delete().eq("id", project_id);
}


// ============= ISSUES ==================
export async function getIssues(project_id: string) {
  const db = supabaseBrowser();
  const { data, error } = await db
    .from("issues")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addIssue(project_id: string, title: string) {
  const db = supabaseBrowser();

  const { data: { user } } = await db.auth.getUser();

  await db.from("issues").insert({
    project_id,
    title,
    status: "todo",
    created_by: user?.id,
  });
}

export async function updateIssueStatus(id: string, status: string) {
  const db = supabaseBrowser();
  await db.from("issues").update({ status }).eq("id", id);
}

export async function deleteIssue(id: string) {
  const db = supabaseBrowser();
  await db.from("issues").delete().eq("id", id);
}
