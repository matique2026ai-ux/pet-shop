import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// GET: Fetch approved comments for a blog post
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_slug", slug)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching blog comments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add a new comment
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const body = await request.json();
    const { user_name, comment } = body;

    if (!user_name || !comment) {
      return NextResponse.json({ error: "Name and comment are required" }, { status: 400 });
    }

    const supabase = createClient();
    
    // Get user session if logged in
    const { data: { session } } = await supabase.auth.getSession();
    const user_id = session?.user?.id || null;

    const { data, error } = await supabase
      .from("blog_comments")
      .insert([
        {
          post_slug: slug,
          user_id,
          user_name,
          comment,
          status: "approved", // Automatically approve for now, or could be 'pending'
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating blog comment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
