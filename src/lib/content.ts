/**
 * All site content, ported verbatim from the Design export's DCLogic component.
 * Keeping it in one place mirrors the original's single data source.
 */

export type Route = "/" | "/about" | "/news" | "/partner" | "/faq";

export interface NavItem {
  n: string;
  title: string;
  dur: string;
  href: Route;
}

// Tracklist drawer — nav items styled as "songs".
export const navItems: NavItem[] = [
  { n: "01", title: "Home", dur: "2:14", href: "/" },
  { n: "02", title: "About", dur: "3:41", href: "/about" },
  { n: "03", title: "Ligo News", dur: "2:58", href: "/news" },
  { n: "04", title: "Become a Partner", dur: "4:07", href: "/partner" },
  { n: "05", title: "FAQ", dur: "1:52", href: "/faq" },
];

// ---- Homepage polaroid collage --------------------------------------------

export interface Polaroid {
  /** filename under /public/photos, or null for the "add yours" tile */
  src: string | null;
  caption: string;
  /** absolute placement — any subset of edges, as CSS length strings */
  pos: { left?: string; right?: string; top?: string; bottom?: string };
  width: number;
  rotate: number;
  /** toss-in stagger delay, seconds */
  delay: number;
  /** smaller center-cluster polaroids sit behind the prompt glow */
  small?: boolean;
  /** the dashed "add yours →" tile that opens the submit modal */
  addTile?: boolean;
}

export const polaroids: Polaroid[] = [
  // left column
  { src: "silentdisco.png", caption: "front row energy", pos: { left: "2%", top: "12%" }, width: 160, rotate: -8, delay: 0.1 },
  { src: "sabrina.png", caption: "backyard show", pos: { left: "14%", top: "23%" }, width: 120, rotate: 5, delay: 0.85 },
  { src: "billie.png", caption: "up on shoulders", pos: { left: "1%", top: "42%" }, width: 150, rotate: 6, delay: 0.5 },
  { src: "sza-saturn.png", caption: "gameday fit check", pos: { left: "15%", top: "57%" }, width: 116, rotate: -4, delay: 0.7 },
  { src: "georgetown.png", caption: "healy at golden hr", pos: { left: "3%", bottom: "6%" }, width: 158, rotate: 5, delay: 0.35 },
  { src: null, caption: "add yours →", pos: { left: "17%", bottom: "9%" }, width: 130, rotate: 4, delay: 1.15, addTile: true },
  // right column
  { src: "taylor.png", caption: "the pit, 1am", pos: { right: "2%", top: "12%" }, width: 160, rotate: 7, delay: 0.2 },
  { src: "howard.png", caption: "the yard", pos: { right: "14%", top: "23%" }, width: 120, rotate: -6, delay: 0.95 },
  { src: "chappell.png", caption: "conga line", pos: { right: "1%", top: "42%" }, width: 150, rotate: -5, delay: 0.55 },
  { src: "frank-blond.png", caption: "the resident djs", pos: { right: "15%", top: "57%" }, width: 116, rotate: 4, delay: 0.75 },
  { src: "kendrick.png", caption: "he played our song", pos: { right: "3%", bottom: "6%" }, width: 158, rotate: -6, delay: 0.4 },
  { src: "clubgirl.png", caption: "campus after dark", pos: { right: "16%", bottom: "9%" }, width: 130, rotate: 6, delay: 1.05 },
  // center cluster (small, behind the glow)
  { src: "kendrick.png", caption: "the drop", pos: { left: "35%", top: "0%" }, width: 110, rotate: -5, delay: 1.2, small: true },
  { src: "frank-blond.png", caption: "headliners", pos: { right: "33%", top: "2%" }, width: 108, rotate: 6, delay: 1.3, small: true },
  { src: "billie.png", caption: "on shoulders", pos: { left: "29%", bottom: "1%" }, width: 114, rotate: 5, delay: 1.35, small: true },
  { src: "sza-saturn.png", caption: "gameday fit check", pos: { right: "30%", bottom: "0%" }, width: 110, rotate: -6, delay: 1.4, small: true },
];

// ---- Homepage payoff ------------------------------------------------------

// The wall is now live (all-time, ranked, merged per track) — served by
// /api/answers from the wall_ranking view. See src/lib/pick.ts for the types.

// Photos that rain down as the payoff — real music/campus/party moments only
// (no school logos/mascots; those read as branding, not moments). Distributed
// evenly around the full frame so it reads as a complete wall. The center
// radial wash keeps the headline + wall card legible over them.
export interface DriftPhoto {
  src: string;
  caption: string;
  /** horizontal position (%) */
  x: number;
  /** resting vertical position (%) once it has fallen in */
  y: number;
  size: number;
  rotate: number;
  delay: number;
}
export const driftPhotos: DriftPhoto[] = [
  // top band — kept clear of the floating logo + hamburger in the top-left corner
  { src: "silentdisco.png", caption: "front row energy", x: 66, y: 14, size: 148, rotate: -7, delay: 0.05 },
  { src: "sza-saturn.png", caption: "the drop", x: 38, y: 1, size: 116, rotate: 5, delay: 0.2 },
  { src: "frank-blond.png", caption: "the resident djs", x: 60, y: 3, size: 118, rotate: -6, delay: 0.32 },
  { src: "taylor.png", caption: "the pit, 1am", x: 84, y: 5, size: 152, rotate: 6, delay: 0.12 },
  // upper sides
  { src: "clubgirl.png", caption: "campus after dark", x: 13, y: 20, size: 120, rotate: 4, delay: 0.5 },
  { src: "band2.png", caption: "the encore", x: 88, y: 22, size: 126, rotate: -5, delay: 0.42 },
  // middle band — fills the previously sparse middle-right
  { src: "billie.png", caption: "up on shoulders", x: 2, y: 40, size: 134, rotate: 5, delay: 0.6 },
  { src: "kendrick.png", caption: "he played our song", x: 24, y: 44, size: 118, rotate: -4, delay: 0.85 },
  { src: "chappell.png", caption: "conga line", x: 74, y: 40, size: 138, rotate: -5, delay: 0.55 },
  { src: "campusstage.png", caption: "packed house", x: 90, y: 46, size: 128, rotate: 6, delay: 0.7 },
  // lower-middle
  { src: "sabrina.png", caption: "backyard show", x: 12, y: 62, size: 122, rotate: 6, delay: 0.95 },
  { src: "frank-blond.png", caption: "3am set", x: 62, y: 60, size: 120, rotate: 4, delay: 1.05 },
  { src: "taylor.png", caption: "the encore", x: 87, y: 66, size: 132, rotate: -6, delay: 0.8 },
  // bottom band — fills the previously empty lower area
  { src: "kendrick.png", caption: "our song came on", x: 4, y: 82, size: 138, rotate: 4, delay: 1.15 },
  { src: "silentdisco.png", caption: "packed house", x: 32, y: 84, size: 120, rotate: -5, delay: 1.3 },
  { src: "clubgirl.png", caption: "last call", x: 58, y: 84, size: 116, rotate: 5, delay: 1.25 },
  { src: "sza-saturn.png", caption: "gameday fit check", x: 84, y: 82, size: 128, rotate: -4, delay: 1.4 },
];

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
];

// Advisors — separate, lighter tier. Editable list; some names pending public
// confirmation before launch. Add/remove entries here.
export const advisors: Person[] = [
  { name: "Greg Kerwick", role: "Founding Advisor", img: "/photos/greg.png" },
  { name: "Joe Agbasi", role: "Advisor", img: "/photos/joe.png" },
];

// ---- News: blog + announcements, combined ---------------------------------

export interface NewsPost {
  tag: string;
  tagColor: string;
  date: string;
  title: string;
  excerpt: string;
}

export const news: NewsPost[] = [
  { tag: "Launch", tagColor: "#EA580C", date: "Jul 2026", title: "Ligo is live at Howard.", excerpt: "Our second campus is in. The chart, the daily take, the events. All of it, all Bison." },
  { tag: "Product", tagColor: "#4FA6CB", date: "Jun 2026", title: "The daily hot take gets a reveal moment.", excerpt: "Vote, wait, then watch the whole campus’ answer roll in at 8pm sharp." },
  { tag: "Blog", tagColor: "#A13D99", date: "Jun 2026", title: "Why we’ll never add a bio.", excerpt: "A short manifesto on letting the music do the introducing, and why that changes who you meet." },
  { tag: "Announcement", tagColor: "#EA580C", date: "May 2026", title: "We raised our seed round.", excerpt: "What the next year looks like, and the campuses we’re heading to next." },
  { tag: "Blog", tagColor: "#A13D99", date: "Apr 2026", title: "Georgetown’s song of the semester.", excerpt: "We counted every vote. One track ran away with it, and it’s not what you’d guess." },
];

// ---- Partner --------------------------------------------------------------

export interface Partner {
  icon: string;
  iconBg: string;
  title: string;
  sub: string;
  points: string[];
}

export const partners: Partner[] = [
  {
    icon: "🎟",
    iconBg: "rgba(249,115,22,0.12)",
    title: "Clubs & orgs",
    sub: "Fill your shows, mixers, and meetings with the people who already vibe with your sound.",
    points: [
      "Post events to your whole campus in seconds",
      "Tag a playlist so students know the energy before they RSVP",
      "See who’s coming, invite-only or open",
    ],
  },
  {
    icon: "☕",
    iconBg: "rgba(155,216,236,0.28)",
    title: "Local businesses",
    sub: "Cafés, venues, and record stores. Become the room students actually show up to.",
    points: [
      "Reach students by taste, not ads",
      "Feature open-mic nights, happy hours, listening sessions",
      "A partner profile students can follow",
    ],
  },
];

// ---- FAQ: four audience groups --------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
}
export interface FaqGroup {
  name: string;
  color: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    name: "For students",
    color: "#F97316",
    items: [
      { q: "Is this a dating app?", a: "No. Ligo is about meeting people through music: friends, a group, a crew for the concert. If something more happens, that’s on you." },
      { q: "Do I need a profile with photos and a bio?", a: "Nope. Just your name and a school email so we know you’re real. Your music taste is your profile." },
      { q: "Is it free?", a: "Yes, free for students." },
      { q: "Which schools is Ligo on?", a: "Georgetown and Howard right now, with more campuses rolling out. Not on yours yet? Tell us. We go where students pull us." },
    ],
  },
  {
    name: "For local businesses",
    color: "#71C07F",
    items: [
      { q: "How do students find my events?", a: "Your events surface to students on the campus you’re near, matched by the music taste your event is tagged with." },
      { q: "What does it cost?", a: "Partnerships are tiered by campus and reach. Start on the Become a Partner page and we’ll size it with you." },
      { q: "What kind of spots work best?", a: "Cafés, venues, and record stores do great. Anywhere students already gather around sound." },
    ],
  },
  {
    name: "For clubs",
    color: "#A13D99",
    items: [
      { q: "Can we run invite-only events?", a: "Yes. Post openly to campus or keep it invite-only to your members. Your call, per event." },
      { q: "Do we get an admin view?", a: "Every club gets an organizer view to create events, manage groups, and see who’s coming." },
      { q: "Is it free for student orgs?", a: "Yes. Recognized student clubs use Ligo events for free." },
    ],
  },
];
