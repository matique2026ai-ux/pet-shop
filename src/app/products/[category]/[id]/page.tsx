import { Metadata, ResolvingMetadata } from "next";
import ProductClientPage from "./client-page";
import { createClient } from "@/lib/supabase";
import { products as demoProducts } from "@/lib/data";

async function fetchProduct(id: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_url_here") {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) return data;
    }
  } catch (e) {
    console.error("Supabase error fetching product", e);
  }
  return demoProducts.find((p) => p.id === id) || null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string; id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.id);
  
  if (!product) {
    return {
      title: "المنتج غير موجود | مخالب وأجنحة",
    };
  }

  const title = `${product.name} | مخالب وأجنحة`;
  const description = product.description || `اشتري ${product.name} الآن من متجر مخالب وأجنحة بأفضل الأسعار.`;
  const images = product.images?.[0] || product.image ? [product.images?.[0] || product.image] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.id);

  let jsonLd: any = null;
  if (product) {
    const images = product.images?.length ? product.images : (product.image ? [product.image] : []);
    
    // Add BASE URL if images are relative
    const baseUrl = "https://www.pawsandwings.com";
    const absoluteImages = images.map((img: string) => img.startsWith("http") ? img : `${baseUrl}${img}`);

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": absoluteImages,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": "مخالب وأجنحة"
      },
      "offers": {
        "@type": "Offer",
        "url": `${baseUrl}/products/${resolvedParams.category}/${resolvedParams.id}`,
        "priceCurrency": "DZD",
        "price": product.price,
        "availability": product.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    };

    if (product.rating && product.reviews) {
      jsonLd.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviews,
      };
    }
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClientPage />
    </>
  );
}
