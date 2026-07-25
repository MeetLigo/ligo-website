import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root — an unrelated lockfile in the home dir was being
  // inferred. The Design export lives in /reference and is not part of the build.
  turbopack: { root },
  async redirects() {
    return [
      // the page is /partner; catch the natural-plural typo everywhere
      { source: "/partners", destination: "/partner", permanent: true },
      // the FAQ now lives on the home page (students) and /partner (businesses/clubs)
      { source: "/faq", destination: "/#faq", permanent: true },
    ];
  },
};

export default nextConfig;
