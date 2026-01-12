import { supabaseServer } from "@/lib/supabase/server";

export async function getIssues(projectId: string) {
  const supabase = await supabaseServer();

  return await supabase
    .from("issues")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
}

export async function addIssue(projectId: string, title: string) {
  const supabase = await supabaseServer();

  const user = await supabase.auth.getUser();

  return await supabase
    .from("issues")
    .insert({
      project_id: projectId,
      title,
      status: "todo",
      created_by: user.data.user?.id,
    });
}

export async function updateIssueStatus(id: string, status: string) {
  const supabase = await supabaseServer();

  return await supabase
    .from("issues")
    .update({ status })
    .eq("id", id);
}

export async function deleteIssue(id: string) {
  const supabase = await supabaseServer();

  return await supabase
    .from("issues")
    .delete()
    .eq("id", id);
}
