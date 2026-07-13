import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Magic-byte (file signature) prefixes for each allowed type.
const SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF
  "image/gif": [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  "image/avif": [[0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66]], // ftypavif
};

function matchesSignature(bytes: Buffer, sig: number[][]): boolean {
  return sig.some((prefix) => prefix.every((b, i) => bytes[i] === b));
}

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Verify the actual file content matches the declared image type (defeats
  // MIME spoofing where an attacker uploads HTML/JS with a fake image type).
  if (!matchesSignature(buffer, SIGNATURES[file.type])) {
    return NextResponse.json({ error: "File content does not match the declared image type" }, { status: 400 });
  }

  // Sanitize the filename: strip any path separators / directory traversal
  // characters, keep only safe characters, and derive the extension from the
  // validated MIME type (never from the user-supplied name).
  const ext = file.type.split("/")[1].replace(/[^a-z0-9]/gi, "");
  const safeBase = (file.name || "upload")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .slice(0, 40);
  const fileName = `${Date.now()}-${safeBase || "img"}.${ext}`;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from("products").upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(fileName);
  return NextResponse.json({ url: publicUrl });
}
