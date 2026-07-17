export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const BUCKET = "products";
const FOLDER = "hero";
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

// Public: list the current hero videos (falls back to defaults if none).
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage.from(BUCKET).list(FOLDER, { limit: 20 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const videos = (data || [])
      .filter((f: any) => !f.name.endsWith("/"))
      .map((f: any) => supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${f.name}`).data.publicUrl);

    return NextResponse.json({ videos });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}

// Admin: upload a new hero video from the user's device.
export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only video files (MP4, WebM, OGG, MOV) are allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 });
  }

  const safeName = (file.name || "video").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 40);
  const ext = (file.name.split(".").pop() || "mp4").replace(/[^a-z0-9]/gi, "");
  const path = `${FOLDER}/${Date.now()}-${safeName || "video"}.${ext}`;

  const supabase = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  return NextResponse.json({ url });
}

// Admin: delete a hero video.
export async function DELETE(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { name?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([`${FOLDER}/${body.name}`]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
