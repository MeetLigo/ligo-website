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
      // /partner was retired 8/29; clubs live at /clubs now. Both the old page
      // and its natural-plural typo land there instead of 404ing.
      { source: "/partners", destination: "/clubs", permanent: true },
      { source: "/partner", destination: "/clubs", permanent: true },
      // the FAQ lives on the home page
      { source: "/faq", destination: "/#faq", permanent: true },
    ];
  },
  // Club kits (/kits/<slug>) are served by src/app/kits/[slug]/route.ts, which
  // reads public/kits/<slug>.html. A rewrite did this before, but rewrites do
  // not run on Amplify SSR. Make sure those files ship with the server bundle.
  outputFileTracingIncludes: {
    "/kits/[slug]": ["./public/kits/**/*"],
  },
};

export default nextConfig;
