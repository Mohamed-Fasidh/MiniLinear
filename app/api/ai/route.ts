import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { prompt, project_id } = await req.json();

    if (!prompt || !project_id) {
      return NextResponse.json(
        { error: "Missing prompt or project_id" },
        { status: 400 }
      );
    }

    // Get supabase server client
    const supabase = await supabaseServer();

    // Get current user
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Choose model
    const model = "meta-llama/llama-3.2-3b-instruct";

    // Call OpenRouter
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: `Turn this into short task titles (one per line), no numbers:
${prompt}`
          }
        ]
      })
    });

    const json = await res.json();

    const text = json.choices?.[0]?.message?.content || "";
    const tasks = text
      .split("\n")
      .map((t: string) => t.trim())
      .filter(Boolean);

    if (tasks.length === 0) {
      return NextResponse.json({ created: 0 });
    }

    // Insert with user ownership
    await supabase.from("issues").insert(
      tasks.map((t: string) => ({
        project_id,
        title: t,
        status: "todo",
        created_by: user.id
      }))
    );

    return NextResponse.json({ created: tasks.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
