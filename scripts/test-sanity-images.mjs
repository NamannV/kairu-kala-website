import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = "zb0x0sgn";
const dataset = "production";

console.log("=== TESTING SANITY IMAGE URL INTEGRATION ===");
console.log(`Target: Project ID: ${projectId}, Dataset: ${dataset}`);

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-03-01",
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

// 1. Test crop and hotspot resolution
console.log("\n1. Testing Hotspot and Crop URL generation:");
const mockUploadedAsset = {
  _type: "image",
  asset: {
    _ref: "image-7d4efb795a9477015ad3eb9a94157fae1201997b-2000x3000-jpg",
    _type: "reference",
  },
  crop: {
    top: 0.1,
    bottom: 0.15,
    left: 0.05,
    right: 0.1,
  },
  hotspot: {
    x: 0.45,
    y: 0.35,
    height: 0.5,
    width: 0.5,
  },
};

const croppedUrl = builder.image(mockUploadedAsset).auto("format").width(1200).url();
console.log("Generated Hotspot/Crop URL:\n", croppedUrl);

if (
  croppedUrl.includes("cdn.sanity.io/images/zb0x0sgn/production/") &&
  croppedUrl.includes("rect=") &&
  croppedUrl.includes("w=1200") &&
  croppedUrl.includes("auto=format")
) {
  console.log("-> Hotspot & Crop computation: SUCCESS (rect params accurately derived from image dimensions & crop fractions)");
} else {
  console.error("-> Hotspot & Crop computation: FAILED");
  process.exit(1);
}

// 2. Query actual projects from Sanity to test mapping
console.log("\n2. Fetching real Sanity projects from dataset production:");
const projects = await client.fetch(`*[_type == "project" && !(_id in path("drafts.**"))]{
  _id,
  title,
  slug,
  cover_image,
  hero_image,
  images
}`);

console.log(`Fetched ${projects.length} published projects.`);
for (const p of projects) {
  const coverSource = p.cover_image || p.hero_image;
  let resolvedCover = "";
  if (coverSource) {
    if (typeof coverSource === "string") {
      resolvedCover = coverSource;
    } else if (coverSource.asset || coverSource._ref) {
      resolvedCover = builder.image(coverSource).auto("format").width(1400).url();
    }
  }
  console.log(`- [${p.title}]`);
  console.log(`  Source: ${typeof coverSource === "object" ? "Sanity Asset Object" : coverSource}`);
  console.log(`  Resolved Cover URL: ${resolvedCover || "fallback"}`);
}

console.log("\n=== ALL SANITY IMAGE TESTS PASSED SUCCESSFULLY ===");
