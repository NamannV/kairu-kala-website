import { createClient } from "next-sanity";
import fs from "fs";

const envText = fs.readFileSync(".env.local", "utf8");
const env = {};
envText.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=");
  if (k && v.length) env[k.trim()] = v.join("=").trim();
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

const dbData = JSON.parse(fs.readFileSync("data/db.json", "utf8"));

async function sync() {
  console.log("Starting sync to Sanity.io dataset: production...");

  // 1. Sync Projects
  for (const p of dbData.projects || []) {
    const docId = `project-${p.slug}`;
    const doc = {
      _id: docId,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: p.category,
      location: p.location,
      year: p.year,
      short_description: p.short_description,
      full_description: p.description,
      hero_image: p.cover_image_url,
      key_features: Array.isArray(p.specifications) ? p.specifications : [],
      is_featured: p.is_featured,
      is_published: p.is_published,
      display_order: p.display_order,
      images: (p.images || []).map((img, idx) => ({
        _key: `img_${idx}`,
        id: img.id,
        image_url: img.image_url,
        caption: img.caption || img.alt_text || "",
        display_order: img.display_order || idx + 1,
      })),
    };
    await client.createOrReplace(doc);
    console.log(`Synced project: ${p.title} (${docId})`);
  }

  // 2. Sync Carousel Settings
  if (dbData.carousel_settings) {
    const cs = dbData.carousel_settings;
    await client.createOrReplace({
      _id: "carouselSettings",
      _type: "carouselSettings",
      autoplay_enabled: cs.autoplay_enabled,
      autoplay_interval: cs.autoplay_interval,
      initial_project_id: cs.initial_project_id || "project-coastal-cantilever",
    });
    console.log("Synced carousel settings");
  }

  // 3. Sync Founders
  for (const f of dbData.founders || []) {
    const fId = `founder-${f.id || "1"}`;
    await client.createOrReplace({
      _id: fId,
      _type: "founder",
      name: f.name,
      title: f.role,
      bio: f.biography,
      image: f.portrait_url,
      display_order: f.display_order || 1,
    });
    console.log(`Synced founder: ${f.name}`);
  }

  // 4. Sync Site Content
  if (dbData.site_content) {
    for (const [key, val] of Object.entries(dbData.site_content)) {
      await client.createOrReplace({
        _id: `siteContent-${key}`,
        _type: "siteContent",
        key: key,
        value: typeof val === "string" ? val : JSON.stringify(val),
      });
      console.log(`Synced site content: ${key}`);
    }
  }

  console.log("ALL DATA SYNCED SUCCESSFULLY TO SANITY!");
}

sync().catch((err) => {
  console.error("Sync failed:", err.message);
  process.exit(1);
});
