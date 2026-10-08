export const dynamic = "force-static";

/**
 * Android Digital Asset Links for meetligo.com. Same package and the same two
 * signing-cert fingerprints served at
 * https://link.meetligo.com/.well-known/assetlinks.json (upload key + Play App
 * Signing key). Keep the two files in step if a key ever changes.
 *
 * Must be served as application/json with no redirect.
 */
const ASSETLINKS = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.bardsai.ligo",
      sha256_cert_fingerprints: [
        "DE:CA:13:73:22:86:7B:81:89:5C:61:AD:F0:55:4B:B7:20:CD:C8:C5:7F:A4:CB:68:C8:BA:56:58:C7:44:6A:A7",
        "65:3F:D2:FE:19:05:4E:99:E0:00:CB:F3:24:52:35:90:13:63:A4:63:54:DA:27:BD:23:27:C8:0C:5C:8A:EF:5D",
      ],
    },
  },
];

export function GET() {
  return new Response(JSON.stringify(ASSETLINKS), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=3600",
    },
  });
}
