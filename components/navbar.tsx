"use client";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Navbar() {
  async function logout() {
    const supabase =  supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white">
      <Link href="/dashboard" className="font-semibold text-lg">MiniLinear</Link>
      <button onClick={logout} className="text-red-600 font-medium">
        Sign Out
      </button>
    </nav>
  );
}
