import { supabaseServer } from "@/lib/supabase/server";

export async function getProjects() {
  const supabase = await supabaseServer();

  return await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });
}

export async function addProject(name: string) {
  const supabase = await supabaseServer();

  const user  = await supabase.auth.getUser();

  if (!user) throw new Error("User not logged in");

  return await supabase
    .from("projects")
    .insert({
       name,
      user_id: user.data.user?.id,
      created_by: user.data.user?.id,

     })
    .select()
    .single();
}

export async function deleteProject(id: string) {
  const supabase = await supabaseServer();

  return await supabase.from("projects").delete().eq("id", id);
}
