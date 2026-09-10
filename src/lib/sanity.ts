import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Image as SanityImageSource } from "sanity";

export const sanityClient = createClient({
  projectId: "yvrdd92h",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
