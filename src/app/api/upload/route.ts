import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
  "video/mp4", "video/webm", "video/quicktime"
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB

// Magic-byte (file signature) prefixes for each allowed image type.
const SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF
  "image/gif": [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  "image/avif": [[0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66]], // ftypavif
};

function matchesSignature(bytes: Buffer, sig: number[][] | undefined, mime: string): boolean {
  if (mime.startsWith("video/")) {
    if (mime === "video/mp4") {
      const ftypStr = bytes.slice(4, 8).toString("ascii");
      return ftypStr === "ftyp";
    }
    if (mime === "video/webm") {
      return bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
    }
    if (mime === "video/quicktime") {
      const ftypStr = bytes.slice(4, 8).toString("ascii");
      return ["ftyp", "free", "mdat", "wide"].includes(ftypStr);
    }
    return true;
  }
  if (!sig) return false;
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
    return NextResponse.json({ error: "Only image files (JPEG, PNG, WebP, GIF, AVIF) and video files (MP4, WebM, MOV) are allowed" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large. Maximum size is ${isVideo ? "30MB" : "5MB"}` }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Verify the actual file content matches the declared type
  if (!matchesSignature(buffer, SIGNATURES[file.type], file.type)) {
    return NextResponse.json({ error: "File content does not match the declared type" }, { status: 400 });
  }

  // Sanitize the filename
  const ext = file.type.split("/")[1].replace(/[^a-z0-9]/gi, "");
  const safeBase = (file.name || "upload")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .slice(0, 40);
  const fileName = `${Date.now()}-${safeBase || "upload"}.${ext}`;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from("products").upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(fileName);
  return NextResponse.json({ url: publicUrl });
}
