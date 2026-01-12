import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const body = await req.json();
  const { project_id, title } = body;

  const { data, error } = await supabase
    .from("issues")
    .insert({
      project_id,
      title,
      status: "todo",
    }).select();

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ issue: data[0] });
}
