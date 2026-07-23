import { Metadata } from "next";
import BlogClientPage from "./client-page";
import { createClient } from "@/lib/supabase";

async function fetchBlogPost(slug: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_url_here") {
      const supabase = createClient();
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
      if (data) return data;
    }
  } catch (e) {
    console.error("Supabase error fetching blog post", e);
  }
  return null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await fetchBlogPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: "مقال غير موجود | مخالب وأجنحة",
    };
  }

  const titleText = typeof post.title === "string" ? post.title : (post.title?.ar || post.title?.en || "مقال");
  const title = `${titleText} | مدونة مخالب وأجنحة`;
  
  const excerptObj = post.excerpt || post.content;
  const excerptText = typeof excerptObj === "string" ? excerptObj : (excerptObj?.ar || excerptObj?.en || "");
  const description = excerptText ? excerptText.substring(0, 150) : `اقرأ مقال ${titleText} في مدونة مخالب وأجنحة للحيوانات الأليفة.`;
  
  const images = post.image_url ? [post.image_url] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await fetchBlogPost(resolvedParams.slug);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jsonLd: any = null;
  if (post) {
    const baseUrl = "https://www.pawsandwings.com";
    const absoluteImage = post.image_url?.startsWith("http") ? post.image_url : `${baseUrl}${post.image_url}`;

    const titleText = typeof post.title === "string" ? post.title : (post.title?.ar || post.title?.en || "مقال");
    const contentObj = post.excerpt || post.content;
    const contentText = typeof contentObj === "string" ? contentObj : (contentObj?.ar || contentObj?.en || "");

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": titleText,
      "image": absoluteImage ? [absoluteImage] : [],
      "datePublished": post.created_at,
      "dateModified": post.updated_at || post.created_at,
      "author": [{
        "@type": "Person",
        "name": post.author || "مخالب وأجنحة",
      }],
      "publisher": {
        "@type": "Organization",
        "name": "مخالب وأجنحة",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo-badge.png`
        }
      },
      "description": contentText.substring(0, 150)
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogClientPage slug={resolvedParams.slug} />
    </>
  );
}
