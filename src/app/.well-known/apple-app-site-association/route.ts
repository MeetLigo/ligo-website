export const dynamic = "force-static";

/**
 * Apple's universal-links file for meetligo.com and www.meetligo.com.
 *
 * The iOS app (bundle com.bardsai.ligoapp, team 8639W5D5MG) claims both hosts
 * in Ligo.entitlements. The only path it handles on them is /notifications
 * (ligo-backend mobile/src/lib/notificationsLink.ts, HTTPS_PATHS). Every other
 * shared link (/c, /e, /p, /r) lives on link.meetligo.com, which serves its
 * own AASA. Do NOT claim /c/* here: meetligo.com/c/<code> is the Google
 * Calendar feed and must stay a plain web URL.
 *
 * Apple fetches this without following redirects and wants application/json.
 */
const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "8639W5D5MG.com.bardsai.ligoapp",
        paths: ["/notifications", "/notifications/"],
      },
    ],
  },
};

export function GET() {
  return new Response(JSON.stringify(AASA), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=3600",
    },
  });
}
