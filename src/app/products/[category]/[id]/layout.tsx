import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { products as DEMO_CATALOG, Product } from "@/lib/data";

interface Props {
  params: { category: string; id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  
  // Try fetching from Supabase first
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();
  
  // Fallback to DEMO_CATALOG
  const finalProduct = product || DEMO_CATALOG.find((p: Product) => p.id === id);

  if (!finalProduct) {
    return {
      title: "Product Not Found",
    };
  }

  const title = `${finalProduct.name} - Paws & Wings`;
  const description = finalProduct.description 
    ? finalProduct.description.substring(0, 160)
    : `Buy ${finalProduct.name} at Paws & Wings. Premium pet supplies in Algeria.`;
  
  const image = finalProduct.image || "/logo-badge.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: finalProduct.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductLayout({ children, params }: Props) {
  const { id } = params;
  
  // Try fetching from Supabase first
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();
  const finalProduct = product || DEMO_CATALOG.find((p: Product) => p.id === id);

  return (
    <>
      {finalProduct && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: finalProduct.name,
              image: finalProduct.image ? [finalProduct.image] : undefined,
              description: finalProduct.description || `Buy ${finalProduct.name}`,
              sku: finalProduct.id,
              brand: {
                "@type": "Brand",
                name: "Paws & Wings"
              },
              offers: {
                "@type": "Offer",
                url: `https://pet-shop.com/products/${finalProduct.category}/${finalProduct.id}`,
                priceCurrency: "DZD",
                price: finalProduct.price,
                priceValidUntil: "2027-12-31",
                itemCondition: "https://schema.org/NewCondition",
                availability: finalProduct.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                seller: {
                  "@type": "Organization",
                  name: "Paws & Wings"
                }
              }
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
