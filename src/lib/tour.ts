/**
 * Tour dates for an artist near the user.
 *
 * PLACEHOLDER — this returns MOCK data today. The shape and the single entry
 * point (`getTourDates`) are designed so a real integration drops in without
 * touching the UI:
 *   - Primary:  Ticketmaster Discovery API (keyword = artist, latlong/radius = campus)
 *   - Fallback: Bandsintown Artist Events API
 * Swap the body of `getTourDates` for the real fetch (Ticketmaster → on empty/error,
 * try Bandsintown → still empty ⇒ return []). The UI already handles dates-or-empty.
 */
export interface TourDate {
  id: string;
  /** display-ready, e.g. "Fri · Oct 18" */
  date: string;
  venue: string;
  city: string;
  /** deep link to buy — real API will supply this; mock leaves it undefined */
  ticketUrl?: string;
}

// DC-area placeholders (Georgetown + Howard are in Washington, DC). Swap for
// real results keyed off the user's campus geo.
const PLACEHOLDER_DATES: TourDate[] = [
  { id: "1", date: "Fri · Oct 18", venue: "9:30 Club", city: "Washington, DC" },
  { id: "2", date: "Sat · Oct 19", venue: "The Anthem", city: "Washington, DC" },
  { id: "3", date: "Thu · Oct 24", venue: "Echostage", city: "Washington, DC" },
  { id: "4", date: "Sat · Nov 2", venue: "The Fillmore", city: "Silver Spring, MD" },
];

/**
 * Returns upcoming dates for `artist` near the user, or [] if none / unknown.
 * Async on purpose so the real network call is a drop-in.
 */
export async function getTourDates(artist: string | null | undefined): Promise<TourDate[]> {
  // No artist (e.g. a free-text pick we couldn't match) ⇒ no lookup possible.
  if (!artist || !artist.trim()) return [];

  // TODO(api): replace this mock with Ticketmaster (primary) + Bandsintown (fallback).
  // For now every matched artist returns the placeholder slate so the module and its
  // CTA are demoable; the empty/fallback state is reachable via a free-text pick.
  return PLACEHOLDER_DATES;
}
