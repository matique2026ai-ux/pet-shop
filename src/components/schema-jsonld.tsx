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
        streetAddress: "حي الهضاب",
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
        telephone: "+21336123456",
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
  }, []);

  return null;
}

export function LocalBusinessSchema() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "localbusiness-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PetStore",
      "@id": "https://www.pawsandwings.com/#petstore",
      name: "Paws & Wings",
      image: "https://www.pawsandwings.com/placeholder.svg",
      url: "https://www.pawsandwings.com",
      telephone: "+21336123456",
      priceRange: "د.ج",
      address: {
        "@type": "PostalAddress",
        streetAddress: "حي الهضاب",
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
