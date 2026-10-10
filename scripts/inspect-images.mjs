import { createClient } from "next-sanity";

const client = createClient({
  projectId: "zb0x0sgn",
  dataset: "production",
  apiVersion: "2024-03-01",
  useCdn: false,
});

async function run() {
  const docs = await client.fetch(`*[_type == "project"]{
    _id,
    title,
    hero_image,
    cover_image,
    image,
    mainImage,
    images
  }`);
  console.log(JSON.stringify(docs, null, 2));
}

run();
