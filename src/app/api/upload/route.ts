import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const supabase = createClient();
  const { data, error } = await supabase.storage.from("products").upload(fileName, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(fileName);
  return NextResponse.json({ url: publicUrl });
}
