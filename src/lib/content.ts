/**
 * All site content, ported verbatim from the Design export's DCLogic component.
 * Keeping it in one place mirrors the original's single data source.
 */

export type Route = "/" | "/about" | "/news" | "/careers";

export interface NavItem {
  n: string;
  title: string;
  dur: string;
  href: Route;
}

// Tracklist drawer — nav items styled as "songs".
export const navItems: NavItem[] = [
  { n: "01", title: "About", dur: "3:41", href: "/about" },
  { n: "02", title: "Ligo News", dur: "2:58", href: "/news" },
  { n: "03", title: "Careers", dur: "4:12", href: "/careers" },
];


// ---- Homepage payoff ------------------------------------------------------

// The wall is now live (all-time, ranked, merged per track) — served by
// /api/answers from the wall_ranking view. See src/lib/pick.ts for the types.


// ---- About: the team ------------------------------------------------------

export interface Person {
  name: string;
  role: string;
  /** photo under /public/photos */
  img: string;
}

// Core team — photo / name / role.
export const team: Person[] = [
  { name: "Micah McNeil", role: "Co-founder & CEO", img: "/photos/micah.png" },
  { name: "Ryan Hofman", role: "Co-founder & CTO", img: "/photos/ryan.png" },
  { name: "TJ Dozier", role: "Marketing / Social Media Management", img: "/photos/tj.png" },
  { name: "Mekhi Simpson", role: "Content & Marketing", img: "/photos/mekhi.png" },
  // Leonard — Product Design: card held until /public/photos/leonard.png is provided.
  // { name: "Leonard", role: "Product Design", img: "/photos/leonard.png" },
  { name: "Will Carragher", role: "Student Associate", img: "/team/will.jpg" },
];

// Advisors — separate, lighter tier. Editable list; some names pending public
// confirmation before launch. Add/remove entries here.
export const advisors: Person[] = [
  { name: "Greg Kerwick", role: "Founding Advisor", img: "/photos/greg.png" },
  { name: "Joe Agbasi", role: "Advisor", img: "/photos/joe.png" },
  { name: "Eric Woods", role: "Advisor", img: "/team/eric-woods.png" },
];




// ---- Landing (broad ethos, Aug 2026 redesign) -----------------------------
// Ported from the Claude Design export "Ligo Landing v3" — audience-split hero,
// club benefits, category showcase. No music framing on the landing (8/28 call).

export interface ClubLogo {
  /** file under /public/clubs */
  src: string;
  name: string;
}

// Real Georgetown club logos (from Micah/Mekhi, 8/28). Shown as one flat strip
// under the launch-campus heading; the categories live in the copy line so no
// club gets mislabeled. Names are display/alt text.
export const clubLogos: ClubLogo[] = [
  { src: "aepi.png", name: "AEPi" },
  { src: "sae.png", name: "SAE" },
  { src: "lasa.png", name: "LASA" },
  { src: "aasa.png", name: "AASA" },
  { src: "sas.png", name: "South Asian Society" },
  { src: "prospect.png", name: "Prospect Records" },
  { src: "guzaarish.png", name: "Guzaarish" },
  { src: "rangila.png", name: "Rangila" },
];
