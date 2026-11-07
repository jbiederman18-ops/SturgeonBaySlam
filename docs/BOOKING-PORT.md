# Booking Port Spec: Tony Khan Simulator → Sturgeon Bay Slam

A handoff for rebuilding Sturgeon Bay Slam's booking around the tap-to-pick flow that Tony Khan Simulator (TKSim) settled on between v273 and v295. Drop this file into the SturgeonBaySlam repo (e.g. `docs/BOOKING-PORT.md`) or paste it into a Sturgeon Bay Slam chat as the brief.

The reference implementation is `cards.js` in jbiederman18-ops/TKSim (v295). Everything below describes *behavior*, so it can be rebuilt on SBS's own data model rather than copied.

---

## 1. The core idea

**Tap is the main input. Drag is only for rearranging.**

- Tapping an empty space on a segment opens a **pick sheet** that slides up from the bottom, showing wrestler cards ranked for *that specific space*, each with a reason tab.
- One tap on a card places that wrestler. The sheet then moves itself to the next empty space, or closes when the segment is complete.
- Drag remains for things already on the card: moving a wrestler to another segment, trading two wrestlers, sending someone back, and reordering segments.

Why: on a phone, the roster is too big to browse as a fanned hand, and drag-to-drop fights scrolling and hides the target under your thumb. Tapping keeps the card look but makes each booking decision one tap.

---

## 2. The pick sheet, top to bottom

| Row | What it does |
|---|---|
| **Header** | Small label for the slot ("Main event", "Match 3", "Promo") with a big question for the space being filled: "Who opens it?", "Who faces Sweeps?", "Partner for Sweeps", "Who's the third corner?", "Who's on the mic?", "Who's out there with X?", "Who replaces X?" ✕ closes. |
| **Swap confirm** (only when needed) | "X is already on the card tonight. A second match costs more stamina. [No] [Book twice]" |
| **Shape row** (matches) | Singles · Tag · Trios · Triple threat · Four-way (SBS: add Battle royal). Choosing one lays out every empty space on the segment immediately. Shrinking the shape sends extras back with a toast: "2 sent back to the roster." |
| **Segment type row** (promos) | Every promo type as chips, same look as the shape row. You can choose it before or after picking the talker. Types that need a condition (TKSim: Champion's Address needs a champion) hide when the picked talker doesn't qualify, but show while no one is picked yet. |
| **Mode / filter chips** | `Stips & titles` (or `Segment` for promos) toggles into the extras view once the segment is legal. Then filters: **Best fit** (default) · Champions · Faces · Heels · All. |
| **Card grid** | In Best fit, two groups: **"Needs you tonight"** (obligations) then **"Best fits"**. Up to 12 cards. Other filters show a plain list sorted by overall (or mic for promos). Cards deal in with a short stagger (30ms each, capped at 8). |
| **Footer** (swap mode only) | [Send back] [Details] |

Sheet behavior rules:
- Opening the sheet resets the filter to Best fit.
- Re-rendering while the sheet is open (picking a shape, a promo type, a stip) **keeps the sheet open and preserves its scroll position**.
- After a pick, if more spaces are empty, stay open and retarget; otherwise close.
- Tapping the backdrop or swiping the sheet header down closes it. Ignore the backdrop click that lands within ~450ms of the tap that opened it.
- Escape closes; Enter/Space activates focused cards (keyboard and TV remote friendly).
- The segment being booked scrolls to sit centered in the space between the header and the top of the sheet.

---

## 3. Fill order

The sheet always knows which space it is filling next. With a shape chosen, it fills **row by row across sides**, except that team sides fill completely first:

1. **Tag and trios: pick every teammate in a row before the opponents** (TKSim v294). After picking a wrestler on a multi-person side, the next pick goes to that same side's next empty spot. Only chain when the slot was empty or someone new was swapped in; reopening a filled slot and closing changes nothing.
2. Once a side is complete, move to the opposing side. In TKSim this is where an **auto-rival** fill can suggest the obvious opponent.
3. Singles / triple threat / four-way: corner by corner.
4. Promos: talker first, then the second wrestler (labeled "Opponent" when the type requires one, "Second (optional)" otherwise).

Tapping a specific "+" space on the segment overrides the default target for that one pick.

---

## 4. Ranking the cards ("Best fit")

Each candidate gets a score and at most one **reason tab** (short text + a color class). The tab tells the player *why* without exposing numbers.

**With no one in the segment yet (opening pick):**

| Reason | Class | Weight |
|---|---|---|
| Promised a match | must | 90 |
| Has a request (show the actual ask, e.g. "Wants a title shot", trimmed to ~42 chars) | must | 80 |
| Title defense due (4+ weeks since last) | must | 75 |
| Hot feud with an available rival ("Feud · Lastname") | feud | 40 + heat/4 |
| Great talker (promos, mic ≥ 85) | hot | 30 |
| Champion | gold | 18 |
| Top star and fresh | — | 12 |

**With someone already in (opponent/partner pick, measured against that "anchor"):**

| Reason | Class | Weight |
|---|---|---|
| Promised vs the anchor | must | 95 |
| "Rivals" (heat ≥ 20) / "Feud" (heat ≥ 5) | feud | 55+ / 38+ |
| "Team" (partner picks, existing team) | hot | 50+ |
| Known chemistry, good (word like "Best chemistry") | hot | 30 + chem |
| Never met but promising: "Electric?" | hot | 20 + chem |
| "Rub" (anchor 15+ more popular, candidate ≥ 45) — max 2 shown | rub | 14 |
| Has a request | must | 26 |
| "Face v heel" / "Never met" | — | 8 |

**Score adjustments on top:** + (overall − 75)/3 (or (mic − 70)/3 for promos); + chemistry with anchor clamped to −6…+10; promos + min(12, heat/4); **−45 if already booked tonight**; minus a tiredness penalty. Injured and maxed-out wrestlers never appear. Anyone already booked shows dimmed ("used") rather than hidden.

Design rule from the TKSim notes: **qualitative tells, not exact bonuses.** Chemistry is discovered after a first meeting, so "Never met"/"Electric?" stand in for numbers.

---

## 5. On the segment itself

- **Empty segment:** "Tap to book it." (optional slots: "Optional. Tap to book it, or leave it empty.") plus a "Book it"/"Add" tag in the header.
  - Bug lesson from v295: hide these tags **only while the sheet is actually open on that segment**, not merely because it's the background-selected slot. Otherwise the main event loses its tag.
- **Spaces** render as dashed "+" plates with labels: Pick / Opponent / Partner / Third / Fourth. The space the sheet is filling glows.
- **Winner:** a 👑 Win button under each side; tap to set the winner. Winner card gets a winning style.
- **Pin-taker:** when the losing side has 2+ people, each loser gets a small "Pin" toggle; one shows "Takes the pin". Respect refusals (TKSim: creative control → toast explaining they won't agree).
- **Tap a placed wrestler** → opens the sheet in swap mode ("Who replaces X?"), anchored on the other side.
- **Modifier chips** under the segment: stipulation (gold when it suits the wrestlers), title on the line, run-in, "Screwy finish".
- **Summary line** once legal: "Tag · Sweepstakes & Deductibles wins · Promised".
- **Crowd read in words**, not stars: "Should deliver", "Solid", "Risky", or what's missing ("Needs an opponent", "Needs a partner on the left").
- **Details** button opens the full editor for everything the sheet doesn't cover (finishes, run-ins).

---

## 6. Extras view ("Stips & titles" / "Segment")

Available once the segment is legal. A list of tappable rows, each with a kicker, a name and one line of why:

- Titles that can be on the line: "X on the line" — "Counts as a title defense." Tap again to make it non-title.
- Stipulations allowed for this shape and show: "Suits Sweeps & The Tooth." / "Tough for X." / the stip's own first sentence. Sort: current choice first, then suiting, then standard, then tough. Show cost in the kicker if a stip costs money.
- Vacant titles: "Crown the first X champion."
- Last row: "Everything else — Finish & run-ins → open the full editor."
- Promos: each segment type with a fit hint from the talker ("Unhappy, so the interview is the pick-me-up"), or "Needs a second wrestler."

---

## 7. Drag (secondary)

- Hold a placed wrestler (~260ms) to pick them up. Drop on another segment's space to move them; drop on another wrestler to trade places (same segment or across); drop outside to send them back. Hold and release without moving opens their details.
- Flick a placed wrestler sideways to send them back.
- Segment numbers are drag handles for reordering. **Whatever sits in the last slot is the main event**; there is no separate main-event flag.
- While dragging, block page scroll (iOS needs `touchmove` `preventDefault` with `passive:false`).

---

## 8. Rules the flow enforces (with toasts)

- Same wrestler twice in one segment: "X is already in this match."
- Per-show match limit and a second-match stamina cost → confirm row, not a block.
- Two people can't share two promos in one night.
- Segment full: "Match 3 is full — pick a bigger match or swap someone out."
- Triple threats and four-ways are one per corner.
- Removing someone from a promised match: warn that fans are still expecting it.
- Half-built segments live in a **draft** until legal, then commit to the card. (SBS already separates `state.drafts` from `state.card` — keep that.) Changing shape or wrestlers re-validates stip, title, run-in and pin-taker and clears any that no longer apply.
- Locked during multiplayer lock-in / live show.

---

## 9. Screen-level choices that came with it

- Production options visible on the Book screen, with **Go live at the very bottom**.
- "Needs your attention" checklist sits right above production and Go live: essentials on top, the rest in a dropdown.
- Optional compact one-line plates for a denser card view.
- "Suggest the rest" fills remaining slots from wrestlers' traits only, ignoring stories and obligations, so it never plays the game for you.
- Small haptic tick and a tap sound on each pick.

**Josh's design constraints (carry over):** no rounded pills, soft shadows or floating capsule nav; no pop-up helper text; no auto-scrolling beyond centering the active segment; no heavy animations; keep screens uncluttered; only wrestlers are cards (menus and decisions are straight-edged panels).

---

## 10. Mapping to Sturgeon Bay Slam

| TKSim | SBS today | Port note |
|---|---|---|
| `SHAPES` row | `MATCH_FORMATS` (sizes arrays) in `matches.js` | Drive the shape row straight from `MATCH_FORMATS`, including Battle royal. "Choose the match format before casting" becomes a row at the top of the sheet you can change anytime. |
| Fill order / `defTarget` | `bookingResumeStep` (format → p0…pn → finish) | Keep p0…pn, but order positions so a team side fills before the next side. Skip the "format" step by defaulting to Singles. |
| `why()` + `hand()` | `opponentFit()` returns `{score, reasons}` | Extend `opponentFit` to return one short reason tab + class, add the obligation group (open promises, requests, Sweeps' qualifier). |
| "Needs you tonight" | Promises with deadlines, story suggestions, qualifier guidance | These are the "must" tier. |
| Pick sheet | Poster hand (`posterHand`, `posterBooking`) | Turn the hand into the bottom sheet; keep the boxing-window poster look for the cards and the card itself. |
| Extras view | Winner, rules, finish, presentation, prop, interference | Winner goes on the segment as crowns; rules + presentation + prop go in the extras view; finish and interference stay in Details unless they fit cleanly. |
| Promo type row | Solo address / face-off / interview / interruption, explicit target | Same chip row; types needing a target show "Opponent" for the second space. |
| Drafts vs card | `state.drafts` vs `state.card` | Already matches TKSim's draft model. |
| Crowd read | Desk forecasts, `matchRead` | Use words, not numbers. |

Follow SBS's `AGENTS.md`: run `node tests/game.test.cjs` and `node tests/webapp.test.cjs`, bump shell asset versions with `sw.js`, and keep existing careers and saves working (a save mid-booking must load into the new flow).

---

## 11. Acceptance checklist

- [ ] Booking a full four-segment show on a phone takes only taps; no drag needed.
- [ ] Tap an empty segment → sheet opens on the first empty space with a question header.
- [ ] Shape row lays out spaces instantly; shrinking sends extras back with a toast.
- [ ] Tag/trios: picking a teammate jumps to the next teammate before the opponents.
- [ ] Best fit shows "Needs you tonight" then "Best fits", each card with one reason tab.
- [ ] Already-booked wrestlers are dimmed; picking one asks to book twice.
- [ ] Sheet stays open with scroll kept when changing shape, promo type or stip; closes when the segment is full.
- [ ] Promo type chips work before and after picking the talker; conditional types hide correctly.
- [ ] Crown sets the winner; pin toggle appears with 2+ losers.
- [ ] Tapping a placed wrestler opens swap mode.
- [ ] "Tap to book it" stays visible on every empty segment, including the main event, whenever the sheet is closed.
- [ ] Drag still moves, trades and reorders; last slot is the main event.
- [ ] Old saves and half-built drafts load into the new flow.
- [ ] Tests pass and the tutorial/tour reflects the new flow.
