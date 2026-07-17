import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

// GET: Fetch a single blog post by slug
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a blog post (Admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: paramSlug } = await params;
  try {
    const adminSecretHeader = request.headers.get("x-admin-secret");
    if (adminSecretHeader !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, content, image_url, author, seo_keywords, published } = body;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        slug,
        title,
        content,
        image_url,
        author,
        seo_keywords,
        published: !!published,
        updated_at: new Date().toISOString()
      })
      .eq("slug", paramSlug)
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
    console.error("Error updating blog post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a blog post (Admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const adminSecretHeader = request.headers.get("x-admin-secret");
    if (adminSecretHeader !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("slug", slug);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
