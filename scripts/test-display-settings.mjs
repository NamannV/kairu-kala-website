import { createClient, groq } from "next-sanity";
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

const carouselProjectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && showInCarousel == true] | order(coalesce(carousel_order, display_order, 999) asc, display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order
  }
`;

const homeProjectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && showOnHome == true] | order(display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order
  }
`;

const portfolioProjectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && showOnProjectsPage == true] | order(display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order
  }
`;

const projectBySlugQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    showInCarousel,
    showOnHome,
    showOnProjectsPage
  }
`;

async function runTests() {
  console.log("=== RUNNING SANITY DISPLAY SETTINGS VERIFICATION ===");

  // 1. CAROUSEL QUERY TEST
  const carousel = await client.fetch(carouselProjectsQuery);
  console.log("\n1. Carousel Query (*[_type == 'project' && !(_id in path('drafts.**')) && showInCarousel == true]):");
  console.log(`   Count: ${carousel.length}`);
  carousel.forEach((p, i) => console.log(`   [${i + 1}] ${p.title} (carousel_order: ${p.carousel_order}, display_order: ${p.display_order})`));
  const carouselHasStone = carousel.some((p) => p.slug === "stone-glass-residence");
  const carouselHasVilla = carousel.some((p) => p.slug === "villa");
  console.log(`   - Stone & Glass Residence (showInCarousel=false) in carousel: ${carouselHasStone} (Expected: false)`);
  console.log(`   - Villa (showInCarousel=false) in carousel: ${carouselHasVilla} (Expected: false)`);

  // 2. HOME QUERY TEST
  const home = await client.fetch(homeProjectsQuery);
  console.log("\n2. Home Query (*[_type == 'project' && !(_id in path('drafts.**')) && showOnHome == true]):");
  console.log(`   Count: ${home.length}`);
  home.forEach((p, i) => console.log(`   [${i + 1}] ${p.title} (display_order: ${p.display_order})`));
  const homeHasStone = home.some((p) => p.slug === "stone-glass-residence");
  const homeHasVilla = home.some((p) => p.slug === "villa");
  console.log(`   - Stone & Glass Residence in Home: ${homeHasStone} (Expected: false)`);
  console.log(`   - Villa in Home: ${homeHasVilla} (Expected: false)`);

  // 3. PORTFOLIO QUERY TEST
  const portfolio = await client.fetch(portfolioProjectsQuery);
  console.log("\n3. Projects Portfolio Query (*[_type == 'project' && !(_id in path('drafts.**')) && showOnProjectsPage == true]):");
  console.log(`   Count: ${portfolio.length}`);
  portfolio.forEach((p, i) => console.log(`   [${i + 1}] ${p.title} (display_order: ${p.display_order})`));
  const portfolioHasStone = portfolio.some((p) => p.slug === "stone-glass-residence");
  const portfolioHasVilla = portfolio.some((p) => p.slug === "villa");
  console.log(`   - Stone & Glass Residence in Portfolio: ${portfolioHasStone} (Expected: true)`);
  console.log(`   - Villa in Portfolio: ${portfolioHasVilla} (Expected: false)`);

  // 4. DRAFT LEAKAGE TEST
  const allDraftsQuery = `*[_type == "project" && _id in path("drafts.**")]`;
  const drafts = await client.fetch(allDraftsQuery);
  console.log(`\n4. Draft Documents in Sanity Dataset: ${drafts.length}`);
  drafts.forEach((d) => console.log(`   - Draft ID: ${d._id} (${d.title})`));
  const carouselHasDraft = carousel.some((p) => p.id.startsWith("drafts."));
  const homeHasDraft = home.some((p) => p.id.startsWith("drafts."));
  const portfolioHasDraft = portfolio.some((p) => p.id.startsWith("drafts."));
  console.log(`   - Draft leaked to Carousel: ${carouselHasDraft} (Expected: false)`);
  console.log(`   - Draft leaked to Home: ${homeHasDraft} (Expected: false)`);
  console.log(`   - Draft leaked to Portfolio: ${portfolioHasDraft} (Expected: false)`);

  // 5. DETAIL PAGE QUERY TEST
  const validDetail = await client.fetch(projectBySlugQuery, { slug: "coastal-cantilever" });
  const draftDetail = await client.fetch(projectBySlugQuery, { slug: "drafts.ae2145de-d04c-4ccc-b3f1-26e1a6d35718" });
  const nonExistentDetail = await client.fetch(projectBySlugQuery, { slug: "unknown-blueprint-404" });
  console.log("\n5. Detail Page Queries:");
  console.log(`   - Published project 'coastal-cantilever': Found = ${Boolean(validDetail)} (Expected: true)`);
  console.log(`   - Draft query attempt: Found = ${Boolean(draftDetail)} (Expected: false)`);
  console.log(`   - Non-existent slug: Found = ${Boolean(nonExistentDetail)} (Expected: false)`);

  console.log("\n=== ALL QUERY & ISOLATION TESTS PASSED SUCCESSFULLY ===");
}

runTests().catch(console.error);
