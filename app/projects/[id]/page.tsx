import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}
