"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/lib/site-settings";

export function OrganizationSchema() {
  const { store } = useSiteSettings();
  const storeName = store?.storeName || store?.name || "Paws & Wings";
  const phone = store?.phone || "+2130776075355";
  const email = store?.email || "hello@pawsandwings.com";
  const address = store?.address || "حي الهضاب، سطيف، الجزائر";

  // FIXED: Updated domain from www.pawsandwings.com to pet-cat.vercel.app
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pet-cat.vercel.app";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "organization-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: storeName,
      url: siteUrl,
      logo: `${siteUrl}/logo-badge.png`,
      description: "متجر إلكتروني متكامل للحيوانات الأليفة في الجزائر. أغذية، إكسسوارات، ورعاية بيطرية متكاملة.",
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
  }, [storeName, phone, email, address, siteUrl]);

  return null;
}

export function LocalBusinessSchema() {
  const { store } = useSiteSettings();
  const storeName = store?.storeName || store?.name || "Paws & Wings";
  const phone = store?.phone || "+2130776075355";
  const address = store?.address || "حي الهضاب، سطيف، الجزائر";

  // FIXED: Updated domain to pet-cat.vercel.app + added additionalType Store
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pet-cat.vercel.app";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "localbusiness-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "PetStore"],
      // FIXED: additionalType Store as requested
      additionalType: "https://schema.org/Store",
      "@id": `${siteUrl}/#petstore`,
      name: storeName,
      image: `${siteUrl}/logo-badge.png`,
      url: siteUrl,
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
  }, [storeName, phone, address, siteUrl]);

  return null;
}

export function WebSiteSchema() {
  const { store } = useSiteSettings();
  const storeName = store?.storeName || store?.name || "Paws & Wings";

  // FIXED: Updated domain to pet-cat.vercel.app
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pet-cat.vercel.app";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "website-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: storeName,
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    });
    document.head.appendChild(script);
    return () => { const s = document.getElementById("website-schema"); if (s) s.remove(); };
  }, [storeName, siteUrl]);

  return null;
}

