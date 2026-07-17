import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

// GET: Fetch all blog posts (published only for guests, all for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminMode = searchParams.get("admin") === "true";

    const supabase = createClient();
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    // If not requesting from admin dashboard, only return published posts
    if (!adminMode) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new blog post (Admin only)
export async function POST(request: Request) {
  try {
    // 1. Check admin secret
    const adminSecretHeader = request.headers.get("x-admin-secret");
    if (adminSecretHeader !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, content, image_url, author, seo_keywords, published } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          slug,
          title,
          content,
          image_url,
          author,
          seo_keywords,
          published: !!published,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: "Slug already exists. Please choose a unique slug." }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
