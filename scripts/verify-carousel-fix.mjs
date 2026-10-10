import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const client = createClient({
  projectId: "zb0x0sgn",
  dataset: "production",
  apiVersion: "2024-03-01",
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

const carouselProjectsQuery = `
  *[_type == "project" && !(_id in path("drafts.**")) && (showInCarousel == true || (showInCarousel != false && is_featured == true))] | order(coalesce(carousel_order, display_order, 999) asc, display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    area_sqft,
    client,
    status,
    short_description,
    full_description,
    key_features,
    cover_image,
    hero_image,
    images[] {
      "id": coalesce(id, _key),
      image_url,
      caption,
      alt_text,
      image_type,
      display_order,
      asset,
      crop,
      hotspot,
      image
    },
    is_featured,
    is_published,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order,
    "created_at": _createdAt,
    "updated_at": _updatedAt
  }
`;

function resolveImageUrl(source, fallback = "/images/projects/coastal-cantilever.jpg") {
  if (!source) return fallback;
  if (typeof source === "string") {
    if (source.startsWith("/") || source.startsWith("http://") || source.startsWith("https://")) {
      return source;
    }
    return fallback;
  }
  if (source.asset || source._ref) {
    return builder.image(source).auto("format").width(1200).url();
  }
  if (source.url && typeof source.url === "string") {
    return source.url;
  }
  return fallback;
}

async function main() {
  console.log("=== RUNNING CAROUSEL QUERY VERIFICATION ===");
  const data = await client.fetch(carouselProjectsQuery);

  console.log(`\nCarousel projects returned: ${data.length}`);
  data.forEach((p, idx) => {
    const coverSource = p.cover_image || p.hero_image;
    const resolvedUrl = resolveImageUrl(coverSource);
    console.log(`[${idx + 1}] "${p.title}" (ID: ${p.id})`);
    console.log(`    carousel_order: ${p.carousel_order}, display_order: ${p.display_order}`);
    console.log(`    Resolved Cover URL: ${resolvedUrl}`);
  });

  const villa = data.find((p) => p.title.toLowerCase().includes("villa"));
  if (villa) {
    const villaCover = resolveImageUrl(villa.cover_image || villa.hero_image);
    console.log("\n✓ VERIFICATION SUCCESS: Villa is returned by the carousel query!");
    console.log(`✓ Villa Cover Image URL: ${villaCover}`);
    if (villaCover.includes("cdn.sanity.io")) {
      console.log("✓ Villa Cover Image is a genuine Sanity CDN URL (cdn.sanity.io)!");
    }
  } else {
    console.error("\n✗ Villa was NOT found in carousel query.");
    process.exit(1);
  }
}

main().catch(console.error);
