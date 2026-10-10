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

async function run() {
  console.log("Migrating Sanity documents with Website Display Settings...");

  // 1. Update project-coastal-cantilever (Featured on all three)
  await client
    .patch("project-coastal-cantilever")
    .set({
      showInCarousel: true,
      showOnHome: true,
      showOnProjectsPage: true,
      carousel_order: 1,
      display_order: 1,
    })
    .commit();
  console.log("Updated: project-coastal-cantilever (Carousel: YES, Home: YES, Projects: YES)");

  // 2. Update project-curvilinear-pavilion (Featured on all three)
  await client
    .patch("project-curvilinear-pavilion")
    .set({
      showInCarousel: true,
      showOnHome: true,
      showOnProjectsPage: true,
      carousel_order: 2,
      display_order: 2,
    })
    .commit();
  console.log("Updated: project-curvilinear-pavilion (Carousel: YES, Home: YES, Projects: YES)");

  // 3. Update project-terracotta-monolith-sanctuary (Featured on all three)
  await client
    .patch("project-terracotta-monolith-sanctuary")
    .set({
      showInCarousel: true,
      showOnHome: true,
      showOnProjectsPage: true,
      carousel_order: 3,
      display_order: 3,
    })
    .commit();
  console.log("Updated: project-terracotta-monolith-sanctuary (Carousel: YES, Home: YES, Projects: YES)");

  // 4. Update project-stone-glass-residence (Portfolio only)
  await client
    .patch("project-stone-glass-residence")
    .set({
      showInCarousel: false,
      showOnHome: false,
      showOnProjectsPage: true,
      carousel_order: 4,
      display_order: 4,
    })
    .commit();
  console.log("Updated: project-stone-glass-residence (Carousel: NO, Home: NO, Projects: YES)");

  // 5. Update user test project Villa (defaults to false everywhere)
  try {
    await client
      .patch("ae2145de-d04c-4ccc-b3f1-26e1a6d35718")
      .set({
        showInCarousel: false,
        showOnHome: false,
        showOnProjectsPage: false,
      })
      .commit();
    console.log("Updated user project Villa: set all toggles to false");
  } catch (e) {
    console.log("User project Villa not patched (might already be handled or draft)");
  }

  // Also update local db.json for consistent fallback
  const dbData = JSON.parse(fs.readFileSync("data/db.json", "utf8"));
  if (dbData.projects) {
    dbData.projects = dbData.projects.map((p) => {
      if (p.slug === "coastal-cantilever" || p.slug === "curvilinear-pavilion" || p.slug === "terracotta-monolith-sanctuary") {
        return {
          ...p,
          showInCarousel: true,
          showOnHome: true,
          showOnProjectsPage: true,
          carousel_order: p.display_order || 1,
        };
      }
      if (p.slug === "stone-glass-residence") {
        return {
          ...p,
          showInCarousel: false,
          showOnHome: false,
          showOnProjectsPage: true,
          carousel_order: 4,
        };
      }
      return {
        ...p,
        showInCarousel: false,
        showOnHome: false,
        showOnProjectsPage: false,
      };
    });
    fs.writeFileSync("data/db.json", JSON.stringify(dbData, null, 2), "utf8");
    console.log("Updated data/db.json with matching display settings.");
  }

  console.log("Migration complete!");
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
