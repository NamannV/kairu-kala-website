'use client';

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";
import { projectId, dataset } from "./lib/sanity/config";

export default defineConfig({
  name: "default",
  title: "Kairu Kala Architecture Studio",
  projectId: projectId || "zb0x0sgn",
  dataset: dataset || "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
