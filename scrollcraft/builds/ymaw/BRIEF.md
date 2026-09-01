# BRIEF — ymaw.com rebuild

Interviewed: Dorian (has run the weekend for 30 years), 2026-09-01, via
AskUserQuestion in-session. Answers recorded verbatim (selected options and
typed answers as given).

## The interview

1. **Vibe (3–5 words):** "Raw adventure" — mud, rope, triumph, energy. The
   physicality of the weekend front and center.
2. **The scroll journey:** "One continuous journey" — the whole page is one
   place: scrolling takes a parent through the weekend itself, Friday arrival
   to Sunday return, no visible section boundaries.
3. **The energy curve:** "Quiet open → build → peak → calm close" — arrive
   quietly Friday, energy climbs through the challenges, peaks at the
   transformation, resolves into a calm Sunday-afternoon decision to register.
4. **Feel + the ONE moment:** Peak chosen: "The transformation" — who he was
   Friday vs. who he is Sunday. The bridge line the current site already
   carries, made physical on screen.
5. **One thing no site does (signature seed):** "The trail line" — a single
   continuous hand-drawn trail line travels the entire page, tying the whole
   weekend together; it reacts to scroll and ends at the registration mark.
6. **Distance from premium-minimal:** "Premium minimal" — clean, spacious.
   (Held in tension with the raw-adventure vibe: the FOOTAGE is raw, the
   design around it stays quiet.)
7. **One unbroken world or scenes:** One unbroken world (same answer as Q2 —
   the fork was put to him explicitly).
8. **Assets owned:** Video clips of activities, lots of photos, drone/scenic
   footage, logo & brand files — in `X:\ESOS\ES Client Work\YMAW`, arriving
   via Google Drive. Until then: 11 real archive photographs already in the
   old repo (Canon/Sony EXIF, 2003–2025), which this build uses as legs.

Step-1 answers (asked in the same interview):

- **What is this / who for:** YMAW — Young Men's Adventure Weekend. A
  three-day outdoor weekend for boys 12–17 near Vancouver BC, run by a
  volunteer production team of men, for 30 years.
- **What must a parent believe by the end:** "He needs this now."
- **The one action:** Register Your Son ($279 CAD, Fall 2026, dates TBA).
  Same label everywhere.
- **Business facts to show:** Fall 2026 · dates announced soon · $279 CAD ·
  Vancouver, BC. No capacity number shown. NO invented statistics; the one
  real number besides price is "30 years", which is Dorian's own claim about
  his own event.

## The feeling curve (written before the acts)

```
1  Stillness      Friday: a boy paddles into the mist alone, vast water, quiet copy
2  Awakening      Saturday dawn: an axe overhead, work with his hands, camp waking
3  Grit           midday: setting out onto open water, effort, the challenge named
4  Intimacy       night: the fire circle under tarps, page at its darkest, 30 years surface
5  Awe            Sunday: every hand raised at the water. THE PEAK. largest leg.
6  Resolve        his face, calm, looking back at you. The decision. Register.
```

No two adjacent acts share a feeling. The silence in front of the peak is act
4's intimacy (small, dark, close) — the peak arrives as scale after closeness.

## The peak

**The sentence a parent would say to a friend:** "You scroll through his whole
weekend, and when Sunday comes the entire screen is hands in the air — and the
boy who comes home is not the one you dropped off."

Lives in leg 5. Gets: the largest weight (2.6vh vs 1.8vh), the only linger
(0.45), the strongest photograph in the archive, and the quiet act before it.

## The tell-someone sentence

> It's the site where you walk a boy's whole weekend with your thumb, and the
> trail you've walked becomes the way to sign your own son up.

The signature move (trail line) lives inside this sentence — merged, per
feel.md §3.

## Authored silence

The first 0.35 of leg 1 carries only the hero copy over water — that quiet is
authored (energy curve: quiet open), not dead scroll. Leg 4 (fire circle) is
deliberately the darkest, slowest-feeling stretch; its copy is smallest. Say so
to the verification pass.

## Structure decisions (uniqueness.md)

- **Grammar: Continuous world (worldflight).** Required by interview answers
  2 and 7. Why the other seven lost: filmic one-shot (the interview explicitly
  chose one unbroken world, and one-shot carries the burden of proof now);
  chaptered editorial (raw adventure + a weekend-as-journey is not a printed
  feature); live surface (not software); typographic poster (30 years of real
  photography is the asset — type-only wastes the archive); gallery (an
  argument, not a collection); split stage (the transformation could read as
  before/after, but the interview chose journey over comparison); rhythmic
  cutlist (bans continuity outright — the exact opposite of the chosen
  structure).
- **Nav: the trail.** The grammar requires a clickable map; the signature move
  IS the map. A vertical trail rail (desktop right edge; mobile: bottom
  hairline) drawn as one path, waypoints Fri dusk → Sat dawn → Sat noon → Sat
  night → Sun → Register. Clickable, stamps as passed, playhead marker is
  "where he is now". Ends at the register mark.
- **Hero device:** worldflight leg 1 with hero copy window (greet). No
  separate title stage.
- **Act-sequence shape:** 6 legs, 5×1.8vh + 2.6vh peak = 11.6vh + 1 spacer =
  12.6vh total (outside the 13.6–13.8 band).
- **Close:** arrival at a face. The last leg holds a boy's direct gaze, calm,
  with the register CTA as the object in that place; finale copy holds to the
  end. No footer-fade — small print lives in the finale block.
- **Signature move:** the trail line (bespoke SVG + JS in the page, driven
  from scroll/`--sc-seg`/`sc:waypoint`; engine untouched).

**Fingerprint gate:** registry is empty (first build in this workspace) —
nothing to clear; row appended after ship.

## The score (device per beat — worldflight form)

| Leg | Beat | Asset (real archive) | w | linger | Copy window |
|---|---|---|---|---|---|
| 1 | Stillness — he sets out | ymaw-mentors.jpg (kayak into mist, Sony) | 1.8 | 0 | hero (greet) |
| 2 | Awakening — the work | ymaw-adventure.jpg (axe overhead, portrait, Canon 5D) | 1.8 | 0 | plateau |
| 3 | Grit — the challenge | ymaw-challenge.jpg (kayaks off the shore) | 1.8 | 0 | plateau |
| 4 | Intimacy — the circle | ymaw-team.jpg (fire pit under tarps, 2003) + archive chips (2003/2006/2025) | 1.8 | 0 | plateau ×2 |
| 5 | Awe — THE PEAK | ymaw-weekend.jpg (hands raised at the water) | 2.6 | 0.45 | plateau (wide) |
| 6 | Resolve — the decision | ymaw-campfire.jpg (his face, direct) | 1.8 | 0 | finale (hold) |

All legs are poster + generated slow camera move (ffmpeg zoompan from the
still, dense GOP) until Dorian's real footage lands from Drive; then legs are
re-cut from footage with the same weights. Pace: every 8s clip carries 1.8vh
(0.225vh/s); the 12s peak carries 2.6vh (0.217vh/s) — rate spread under 4%.

## Palette / type (from the real logo: green wordmark, red fire, yellow sun)

- canvas #0C110D (deep forest off-black) · surface #151C16
- ink #F2EFE7 (bone) · ink-soft #A9AFA0 (tinted)
- accent #E4572E (the logo's fire red-orange) · accent-ink #16100C
- display: Archivo · text: Geist (both Google Fonts, real fallback stacks)

## Honesty rules for this brand

- The three stock photos in the old repo (hero_camp, mountain_break,
  hiking_about — not BC, not YMAW) are dropped and never used.
- No invented statistics anywhere. Price, ages, "30 years", and the archive
  years are the only numbers.
- Registration promises only what the flow does (card now / e-transfer later /
  assistance requested — nothing "instant" that isn't).

## Feel check (run cold against the contact sheets, 2026-09-01)

Felt, one word per act: stillness · work · effort · closeness · lift · calm.
Intended: stillness · awakening · grit · intimacy · awe · resolve.

Diff: acts 1, 2, 4, 5, 6 land. Act 3 reads "calm effort" rather than grit —
the serene kayak frame carries determination, not strain. Accepted for the
photo-built version and flagged: when the real challenge footage arrives from
the archive (mud, ropes, straining faces), leg 3 takes it first.

Peak confirmed on the sheet: the raised-hands frame is the largest visual
change on the page and holds the most scroll room. The act before it (the
circle) is the quietest. The end resolves and holds: face + CTA + small print
remain on the final screen.

## Verification record

- worldflight-assert: 21/24 pass. The 3 fails are documented choices/artifacts:
  lerp 0.12 (worldflight.md §7c) vs the assert's 0.18 expectation; a 68ms
  playhead residual at the fixed 70-frame trace end (software VP9 decode in the
  codec-less test Chromium; converges beyond the window); a seam-release
  sample taken exactly on the band edge where the outgoing leg is already
  fully covered by the opaque incoming leg (z-index 120) — no visible flash.
- shoot.mjs: desktop 1300×900, mobile 390×844, reduced-motion — no dead
  scroll; ALL copy clears 4.5:1 at its worst frame on all three passes.
- The band scrim breathes (0.5 base → 1.0 with copy visibility) so the
  photography carries the copy-free stretches; the circle leg adds a centre
  veil raised via the waypoint event.
- NOT verified: a real phone (decoder, autoplay policy, Low Power Mode,
  touch scrolling). Headless Chrome cannot reproduce those; check on-device
  after deploy and reach for device-diag.html on the first mobile defect.
