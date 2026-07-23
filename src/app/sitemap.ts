import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase";
import { products as demoProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pawsandwings.com";
  
  let products: any[] = demoProducts;
  let blogPosts: any[] = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_url_here") {
      const supabase = createClient();
      
      const { data: dbProducts } = await supabase.from("products").select("id, category, created_at");
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts;
      }

      const { data: dbPosts } = await supabase.from("blog_posts").select("slug, updated_at, created_at");
      if (dbPosts && dbPosts.length > 0) {
        blogPosts = dbPosts;
      }
    }
  } catch (e) {
    console.error("Supabase error generating sitemap", e);
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.category || 'all'}/${product.id}`,
    lastModified: product.updated_at || product.created_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || post.created_at || new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
