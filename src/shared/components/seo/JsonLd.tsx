import { env } from "@/shared/config/env";
import { BUSINESS_AREA_NAMES } from "@/shared/config/businessAreas";

const BASE_URL = env.site.url || "https://ojuec.co.kr";

function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: env.company.name,
    legalName: env.company.fullName,
    url: BASE_URL,
    logo: `${BASE_URL}/images/ojuconstruction-logo.png`,
    foundingDate: "2004",
    address: {
      "@type": "PostalAddress",
      streetAddress: env.company.address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: env.company.phone,
      contactType: "customer service",
      availableLanguage: "Korean",
    },
    email: env.company.email,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: env.company.name,
    image: `${BASE_URL}/images/ojuconstruction-logo.png`,
    url: BASE_URL,
    telephone: env.company.phone,
    email: env.company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: env.company.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.6424,
      longitude: 127.4890,
    },
    areaServed: [
      { "@type": "State", name: "충청북도" },
      { "@type": "State", name: "충청남도" },
      { "@type": "State", name: "세종특별자치시" },
      { "@type": "State", name: "대전광역시" },
    ],
    serviceType: BUSINESS_AREA_NAMES,
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export { OrganizationJsonLd, LocalBusinessJsonLd, BreadcrumbJsonLd };
