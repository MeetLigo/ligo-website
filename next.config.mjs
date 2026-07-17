import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root — an unrelated lockfile in the home dir was being
  // inferred. The Design export lives in /reference and is not part of the build.
  turbopack: { root },
};

export default nextConfig;
