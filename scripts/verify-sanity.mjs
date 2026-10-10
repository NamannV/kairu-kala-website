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

async function main() {
  try {
    const projects = await client.fetch('*[_type == "project"] | order(display_order asc) { _id, title, "slug": slug.current, display_order }');
    const carousel = await client.fetch('*[_type == "carouselSettings"][0]');
    const founders = await client.fetch('*[_type == "founder"]');
    const content = await client.fetch('*[_type == "siteContent"]');

    console.log("SANITY VERIFICATION:");
    console.log("1. Projects count:", projects.length);
    projects.forEach(p => console.log(`   - [${p.display_order}] ${p.title} (${p.slug})`));
    console.log("2. Carousel Settings:", carousel ? { autoplay: carousel.autoplay_enabled, interval: carousel.autoplay_interval } : "None");
    console.log("3. Founders count:", founders.length);
    console.log("4. Site Content items count:", content.length);
  } catch (err) {
    console.error("Verification failed:", err.message);
  }
}

main();
