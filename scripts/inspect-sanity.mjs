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
  const docs = await client.fetch('*[_type == "project"]{ _id, title, "slug": slug.current, is_featured, is_published, display_order, showInCarousel, showOnHome, showOnProjectsPage }');
  console.log("FOUND PROJECTS IN SANITY:", docs.length);
  console.log(JSON.stringify(docs, null, 2));
}

main().catch(console.error);
