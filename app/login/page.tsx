"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
    }
    checkSession();
  }, [router, supabase]);

  async function signIn(provider: "github" | "google") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-10 w-[370px] text-center border border-gray-200">
        <h1 className="text-3xl font-semibold mb-3">Welcome to MiniLinear </h1>
        <p className="text-gray-500 mb-6">Login to continue</p>

        <div className="space-y-3">
          {/* GitHub Login */}
          <button
            onClick={() => signIn("github")}
            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 transition flex items-center justify-center gap-2 w-full"
          >
            <svg className="w-5 h-5" fill="white" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58..." />
            </svg>
            Sign in with GitHub
          </button>

          {/* Google Login */}
          <button
            onClick={() => signIn("google")}
            className="border px-5 py-3 rounded-md hover:bg-gray-100 transition flex items-center justify-center gap-2 w-full"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          By continuing, you agree to our Terms & Privacy
        </p>
      </div>
    </div>
  );
}
