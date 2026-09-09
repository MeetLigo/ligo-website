/**
 * Georgetown Campus Team roles. Single source of truth for /careers,
 * /careers/[role], and the application form's role-specific questions.
 *
 * Copy is organized from Micah's "LIGO Job Roles" + "Ligo Campus GTM" docs
 * (Ligo/Hiring/CAMPUS-TEAM-ROLES.md in iCloud). Titles are working titles.
 */

/** Asked on the first call, not on the application. Kept here so whoever runs
 *  the call has the role's sharp questions in front of them. */
export interface RoleQuestion {
  id: string;
  label: string;
  /** shown under the label, optional */
  hint?: string;
  /** textarea (default), a one-line text, a yes/no pick, or a select with your own options */
  kind: "textarea" | "text" | "yesno" | "select";
  /** for kind "select" */
  options?: string[];
  /** default true; set false for a question they can skip */
  required?: boolean;
}

export interface Role {
  slug: string;
  /** true = written but not listed or applyable right now */
  hidden?: boolean;
  title: string;
  /** one-word lane shown next to the title */
  lane: string;
  /** shown on the card and the posting's meta row */
  openings: string;
  /** the same fact, short enough for a label/value row */
  openingsShort: string;
  hours: string;
  /** the one-liner on the card */
  tagline: string;
  /** a short paragraph under the title on the detail page */
  summary: string;
  whatYouDo: string[];
  typicalWeek: string[];
  lookingFor: string[];
  measuredOn: string;
  notThisRole: string[];
  /** interview prompts for this role. Not rendered on the form. */
  questions: RoleQuestion[];
}

const ALL_ROLES: Role[] = [
  {
    slug: "club-growth-associate",
    title: "Club Growth Associate",
    lane: "Partnerships",
    openings: "One role remaining",
    openingsShort: "One",
    hours: "Part-time",
    tagline: "Turn your Georgetown network into partnerships.",
    summary:
      "You bring Georgetown clubs and organizations onto Ligo. Not just a yes from the president. A club that's set up, sending events, and pushing its members to join.",
    whatYouDo: [
      "Build and keep a target list of Georgetown organizations, and figure out who actually makes the call in each one.",
      "Use warm connections where you have them. Send outreach that reads like a person wrote it where you don't.",
      "Book short conversations, pitch Ligo, follow up, and handle the objections that come back.",
      "Walk interested clubs through setup until they've done something real on Ligo: claimed their page, posted an event, sent a membership push.",
      "Keep the club CRM current. Who you talked to, where they stand, what's next, who referred them.",
      "Ask every activated club for one more introduction.",
    ],
    typicalWeek: [
      "10 to 15 new organizations mapped",
      "15 to 25 personal outreaches sent",
      "3 to 5 real conversations held",
      "1 to 2 clubs activated",
      "Every objection logged so the team learns from it",
    ],
    lookingFor: [
      "You have real campus reach. You've sat on a club board, or you belong to a few orgs that have nothing to do with each other.",
      "You're comfortable asking someone for an intro.",
      "You write like a human, not a template.",
      "You care more about the club actually using Ligo than about the number of emails you sent.",
    ],
    measuredOn: "Clubs that activate. Not messages sent.",
    notThisRole: ["Tabling and flyers", "Student research interviews", "Filming content"],
    questions: [
      {
        id: "club_five_orgs",
        label: "List five Georgetown organizations where you could realistically get a decision-maker to answer you.",
        hint: "Name the org and, if you can, the person or your connection to them.",
        kind: "textarea",
      },
      {
        id: "club_draft_dm",
        label: "Draft the DM or email you would send one of them.",
        hint: "Write it exactly the way you'd send it.",
        kind: "textarea",
      },
    ],
  },
  {
    slug: "campus-growth-associate",
    title: "Campus Growth Associate",
    lane: "Field growth",
    openings: "One role remaining",
    openingsShort: "One",
    hours: "Part-time",
    tagline: "Run real-world growth experiments around campus.",
    summary:
      "You put Ligo in front of students where they actually are. Tables, dorms, flyers, pop-ups, high-traffic campus moments. Every campaign gets its own link, so you learn what works and what doesn't.",
    whatYouDo: [
      "Run tables, pop-ups, dorm campaigns, and activations around the moments students already care about.",
      "Put up posters and flyers, each with its own QR code, and track which placements actually bring people in.",
      "Talk to students directly. Read in seconds whether someone wants the 10-second version or the full conversation.",
      "Run one experiment a week: a new location, a new opener, a new incentive. Report what converted.",
      "Help execute launch moments around new features, big campus events, and referral pushes.",
      "Keep the physical materials stocked and know the campus rules for where things can go.",
    ],
    typicalWeek: [
      "2 field sessions in high-traffic spots",
      "75 to 125 student conversations",
      "25 to 50 students actually set up on Ligo",
      "1 experiment run and written up",
      "10+ student questions and objections captured",
    ],
    lookingFor: [
      "High energy without being annoying about it.",
      "You can walk up to a stranger and you don't take a no personally.",
      "You can explain Ligo in one sentence.",
      "You show up on time, including at the inconvenient campus moments where the crowd is.",
    ],
    measuredOn: "Students who verify, finish setup, and take a real first action. Never raw downloads.",
    notThisRole: ["Closing clubs", "Formal research interviews", "Producing finished social content"],
    questions: [
      {
        id: "growth_twenty_walk_past",
        label: "You're tabling for Ligo and 20 students walk past without stopping. What do you change?",
        kind: "textarea",
      },
      {
        id: "growth_three_moments",
        label: "What are three Georgetown moments or locations where you would test getting students onto Ligo?",
        hint: "Be specific about why each one.",
        kind: "textarea",
      },
    ],
  },
  {
    slug: "consumer-insights-associate",
    hidden: true, // parked 9/8 per Mekhi; flip to false to list it again
    title: "Consumer Insights Associate",
    lane: "Research",
    openings: "One role remaining",
    openingsShort: "One",
    hours: "Part-time",
    tagline: "Talk to students and help shape what Ligo builds.",
    summary:
      "You take a question the team needs answered and go find the truth. Why do freshmen download Ligo and then stop opening it? How do juniors actually hear about events? Your findings don't sit in a spreadsheet. They shape the product and end up in our posts.",
    whatYouDo: [
      "Take one defined question per sprint and design a way to answer it: interviews, usability sessions, short surveys, the occasional focus group.",
      "Recruit the right students for the question. Freshmen, seniors, club-heavy, unaffiliated, people who stopped using Ligo. Not your friend group every week.",
      "Run interviews without leading people to the answer you want.",
      "Take structured notes, tag what repeats, and write a one-page synthesis the team can act on.",
      "Tell us when the evidence says we're wrong. That's the job.",
    ],
    typicalWeek: [
      "5 to 8 real interviews",
      "At least 2 different student segments represented",
      "Notes on every session",
      "1 one-page synthesis",
      "1 open question you think we should test next",
    ],
    lookingFor: [
      "Curious and a little skeptical. A good listener.",
      "You back claims with evidence. \"Based on my dorm's group chat\" beats \"everyone would love this.\"",
      "You write clearly.",
      "You're in a few orgs and know a lot of people. Reach matters more than GPA here.",
      "You're comfortable reporting findings that contradict what we hope is true.",
    ],
    measuredOn: "Insights good enough to make a decision on. Not the number of people you talked to.",
    notThisRole: ["Convincing people to download Ligo", "Club outreach", "Filming or posting content"],
    questions: [
      {
        id: "insights_rewrite",
        label: "Rewrite this question so it isn't leading: \"Wouldn't it be useful to have all Georgetown events in one app?\"",
        kind: "textarea",
      },
      {
        id: "insights_evidence",
        label: "Tell us about a time evidence changed your mind.",
        kind: "textarea",
      },
    ],
  },
  {
    slug: "campus-content-creator",
    title: "Campus Content Creator",
    lane: "Content",
    openings: "One role remaining",
    openingsShort: "One",
    hours: "Part-time",
    tagline: "Capture what's actually happening at Georgetown.",
    summary:
      "You're Ligo's eyes on campus. Rehearsals, games, speakers, traditions, the club nobody knew existed. You film it, you interview people, you host on camera when it helps. Our editor cuts it. Your value is access, instincts, and being there.",
    whatYouDo: [
      "Go where the interesting thing is happening and capture it: club events, practices, speakers, campus traditions, application season.",
      "Run street interviews. Ask 15 students one sharp question and get real answers.",
      "Shoot B-roll that's actually usable: steady, good sound, framed for Reels and TikTok.",
      "Host on camera when the piece needs a person.",
      "Hand the editor an organized package: best clips flagged, names and orgs, what happened, what the story was, three possible hooks.",
      "Pitch a new idea every week.",
    ],
    typicalWeek: [
      "2 capture sessions on campus",
      "1 batch of street interviews, 8 to 15 usable answers",
      "25+ organized raw clips",
      "2 complete editor-ready packages, handed off by Sunday",
      "1 new concept pitched",
    ],
    lookingFor: [
      "Charismatic but not performative. People open up to you.",
      "You get Georgetown humor and culture.",
      "You know what looks natural on TikTok and Reels, and what looks like an ad.",
      "You can film usable sound and framing on a phone.",
      "You're reliable enough to be there when the thing actually happens.",
    ],
    measuredOn: "Packages the editor can actually use. The test: would a Georgetown student watch this if the Ligo logo disappeared?",
    notThisRole: ["Editing", "Posting or scheduling", "Club outreach", "Tabling", "Formal research"],
    questions: [
      {
        id: "content_three_videos",
        label: "Pitch three Georgetown videos you think students would actually watch.",
        kind: "textarea",
      },
      {
        id: "content_on_camera",
        label: "Are you comfortable approaching strangers on camera?",
        kind: "yesno",
      },
    ],
  },
];

/** The roles that are live on /careers and accepted by the application. */
export const roles: Role[] = ALL_ROLES.filter((r) => !r.hidden);

export function getRole(slug: string): Role | undefined {
  return roles.find((r) => r.slug === slug);
}

/** Shared program facts shown on the index and every detail page. */
export const program = {
  campus: "Georgetown University",
  where: "Washington, D.C.",
  term: "10-week sprint, fall 2026",
  pay: "Paid, with pay tied to what you deliver",
  who: "Current Georgetown students",
};

/** The hiring process, in the order the applicant experiences it. */
export const process = [
  { title: "Apply", body: "Under five minutes. Short on purpose: we would rather talk than read." },
  { title: "We read it", body: "Every application gets read by a person, usually the same day." },
  { title: "A short call", body: "15 to 20 minutes with someone on the team. This is where the real questions are." },
  { title: "A paid work sample", body: "A small piece of the real job, and you get paid for it." },
  { title: "Offer and onboarding", body: "A 90-minute onboarding, then a two-week ramp with clear targets." },
];
