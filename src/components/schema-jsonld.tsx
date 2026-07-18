"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/lib/site-settings";

export function OrganizationSchema() {
  const { store } = useSiteSettings();
  const storeName = store?.storeName || store?.name || "Paws & Wings";
  const phone = store?.phone || "+21336123456";
  const email = store?.email || "hello@pawsandwings.com";
  const address = store?.address || "حي الهضاب، سطيف، الجزائر";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "organization-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: storeName,
      url: "https://www.pawsandwings.com",
      logo: "https://www.pawsandwings.com/placeholder.svg",
      description: "Premium pet products and veterinary care for cats, dogs, birds, fish, and small pets.",
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
        addressLocality: "Sétif",
        addressRegion: "Sétif",
        postalCode: "19000",
        addressCountry: "DZ",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 36.1898,
        longitude: 5.4123,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        areaServed: ["Sétif", "Algérie"],
      },
      sameAs: [
        "https://facebook.com/pawsandwings",
        "https://instagram.com/pawsandwings",
      ],
    });
    document.head.appendChild(script);
    return () => { const s = document.getElementById("organization-schema"); if (s) s.remove(); };
  }, [storeName, phone, email, address]);

  return null;
}

export function LocalBusinessSchema() {
  const { store } = useSiteSettings();
  const storeName = store?.storeName || store?.name || "Paws & Wings";
  const phone = store?.phone || "+21336123456";
  const address = store?.address || "حي الهضاب، سطيف، الجزائر";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "localbusiness-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PetStore",
      "@id": "https://www.pawsandwings.com/#petstore",
      name: storeName,
      image: "https://www.pawsandwings.com/placeholder.svg",
      url: "https://www.pawsandwings.com",
      telephone: phone,
      priceRange: "د.ج",
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
        addressLocality: "Sétif",
        addressRegion: "Sétif",
        postalCode: "19000",
        addressCountry: "DZ",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 36.1898,
        longitude: 5.4123,
      },
      areaServed: ["Sétif", "Algérie"],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "20:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      sameAs: [
        "https://facebook.com/pawsandwings",
        "https://instagram.com/pawsandwings",
      ],
    });
    document.head.appendChild(script);
    return () => {
      const s = document.getElementById("localbusiness-schema");
      if (s) s.remove();
    };
  }, [storeName, phone, address]);

  return null;
}

export function WebSiteSchema() {
  const { store } = useSiteSettings();
  const storeName = store?.storeName || store?.name || "Paws & Wings";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "website-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: storeName,
      url: "https://www.pawsandwings.com",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.pawsandwings.com/products?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    });
    document.head.appendChild(script);
    return () => { const s = document.getElementById("website-schema"); if (s) s.remove(); };
  }, [storeName]);

  return null;
}

