import { Studio } from "../Studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

/** /studio: the CMS editor, embedded. Sign-in is Sanity's own. */
export default function StudioPage() {
  return <Studio />;
}
