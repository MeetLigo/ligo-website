import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

/**
 * The embedded Studio, served at meetligo.com/studio. Same project and
 * dataset the site reads from (src/lib/sanity.ts). Anyone with a seat on
 * the Sanity project signs in with their Sanity account and can publish
 * without touching code.
 */
export default defineConfig({
  name: "ligo",
  title: "Ligo",
  basePath: "/studio",
  projectId: "yvrdd92h",
  dataset: "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
