import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: any) {
  const supabase = await supabaseServer();
  const updates = await req.json();

  const { data, error } = await supabase
    .from("issues")
    .update(updates)
    .eq("id", params.id)
    .select();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function DELETE(req: Request, { params }: any) {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("issues")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
