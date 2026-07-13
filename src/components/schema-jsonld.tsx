"use client";

import { useEffect } from "react";

export function OrganizationSchema() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "organization-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Paws & Wings",
      url: "https://www.pawsandwings.com",
      logo: "https://www.pawsandwings.com/placeholder.svg",
      description: "Premium pet products and veterinary care for cats, dogs, birds, fish, and small pets.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Pet Street",
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: "10001",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-234-567-890",
        contactType: "customer service",
      },
      sameAs: [
        "https://facebook.com/pawsandwings",
        "https://instagram.com/pawsandwings",
      ],
    });
    document.head.appendChild(script);
    return () => { const s = document.getElementById("organization-schema"); if (s) s.remove(); };
  }, []);

  return null;
}

export function WebSiteSchema() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "website-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Paws & Wings",
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
  }, []);

  return null;
}

export function VeterinaryClinicSchema() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "vet-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VeterinaryCare",
      name: "Paws & Wings Veterinary Clinic",
      url: "https://www.pawsandwings.com/vet",
      description: "Professional veterinary care for your beloved pets.",
      medicalSpecialty: "VeterinaryMedicine",
      availableService: [
        { "@type": "MedicalService", name: "General Checkup" },
        { "@type": "MedicalService", name: "Vaccination" },
        { "@type": "MedicalService", name: "Dental Care" },
        { "@type": "MedicalService", name: "Surgery" },
      ],
    });
    document.head.appendChild(script);
    return () => { const s = document.getElementById("vet-schema"); if (s) s.remove(); };
  }, []);
  return null;
}
