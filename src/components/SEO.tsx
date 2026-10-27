import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SHOP_CONFIG } from '../config/shop';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Ashapura Farsan - Authentic Gujarati Farsan, Namkeen & Wafers in Mira Road",
  description = "Authentic Gujarati farsan, namkeen, wafers, and festive snacks in Mira Road, Mumbai. Fresh every day, made in-house with traditional recipes. Shop No 7, Jangid Home, Near Hetal Park.",
  canonical,
  ogImage = "/images/hero-farsan.webp",
}) => {
  const { contact } = useStoreSettings();
  const fullTitle = title.includes("Ashapura") ? title : `${title} | ${SHOP_CONFIG.name} Farsan`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FastFoodRestaurant",
    "name": `${SHOP_CONFIG.name} Farsan`,
    "image": "https://ashapurafarsan.com/images/hero-farsan.webp",
    "telephone": [contact.phone_primary_raw, contact.phone_secondary_raw || contact.phone_primary_raw],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contact.address || "Shop No 7, Jangid Home, Near Hetal Park",
      "addressLocality": "Mira Road",
      "addressRegion": "Maharashtra",
      "postalCode": "401107",
      "addressCountry": "IN",
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "10:00",
        "closes": "22:00"
      }
    ],
    "servesCuisine": "Gujarati Farsan, Namkeen & Wafers",
    "priceRange": "₹",
    "hasMap": SHOP_CONFIG.googleMapsUrl,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
