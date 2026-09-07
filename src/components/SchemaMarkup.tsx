import React from "react";

export const SchemaMarkup: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "name": "Autohub New Zealand Limited",
    "alternateName": "Procurly by Autohub",
    "url": "https://procurly.autohub.co.nz",
    "logo": "https://procurly.autohub.co.nz/logo.png",
    "description": "B2B automotive parts procurement, global sourcing, freight logistics, and NZ Customs clearance coordination for New Zealand workshops, dealerships, and fleet managers.",
    "telephone": "+64-9-274-5422",
    "email": "procurement@autohub.co.nz",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Level 2, 86 Highbrook Drive, East Tamaki",
      "addressLocality": "Auckland",
      "postalCode": "2013",
      "addressCountry": "NZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -36.9458,
      "longitude": 174.8872
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:30",
        "closes": "17:30"
      }
    ],
    "priceRange": "$$",
    "areaServed": "NZ"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Procurly by Autohub",
    "url": "https://procurly.autohub.co.nz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://procurly.autohub.co.nz/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "B2B Automotive Parts Procurement & Global Logistics",
    "provider": {
      "@type": "AutomotiveBusiness",
      "name": "Autohub New Zealand Limited"
    },
    "areaServed": {
      "@type": "Country",
      "name": "New Zealand"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Procurement Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Direct Global Parts Sourcing (Japan, Europe, USA)"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Air Express & Consolidated Sea Freight Logistics"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "New Zealand Customs Tariff Classification & MPI Biosecurity Clearance"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
};
