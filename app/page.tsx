import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const db = await supabase();

  const {
    data: { user },
  } = await db.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  redirect("/login");
}
