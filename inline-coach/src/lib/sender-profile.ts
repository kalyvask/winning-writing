// Sender profile: who is writing the email. Passed to Claude as a cached system
// block on every critique and connection-angle call so the "like you" hooks
// and the higher-order critique are grounded in the sender's actual background.
//
// The profile is user data. It lives in chrome.storage.local (set on the
// options page) and is never bundled into the extension. The template below
// is the fallback when nothing has been saved yet; it mirrors the shape of
// context/about-me.md at the repo root so the two can be kept in sync by hand.

export const PROFILE_KEY = 'gmail-writing-coach.profile';

export const DEFAULT_SENDER_PROFILE = `# Sender profile

(No profile saved yet. Open the extension options and paste a short profile so
connection angles and critiques reflect who is actually sending. Until then,
treat the sender as unknown and do not invent biographical details.)

Suggested shape — replace every bracket:

[Name] is a [role] working on [current focus]. Before this: [N years] doing
[the work that built their judgment; name companies and one result with a
number].

## Voice notes
- [One line on posture, e.g. "understate, don't overclaim"]
- [One line on banned constructions, e.g. "no em-dashes outside parens"]
- [One line on which personal hooks are fair game in an opener]

## What to use this for
When drafting anything on the sender's behalf, pull biographical detail from
this profile, then defer to the voice notes for tone.`;

export async function getSenderProfile(): Promise<string> {
  const r = await chrome.storage.local.get([PROFILE_KEY]);
  const saved = typeof r[PROFILE_KEY] === 'string' ? r[PROFILE_KEY].trim() : '';
  return saved || DEFAULT_SENDER_PROFILE;
}
