# Booking, interaction, and visual review

Reviewed November 2, 2026 against the local checkout of `jbiederman18-ops/SturgeonBaySlam`, shell version 7.11. This is an audit and implementation proposal; runtime files were not changed. The pre-existing `GAME-DESIGN-REVIEW.md` was left intact and is not treated as a description of the current implementation.

## Scope and evidence

Read the booking, dashboard, roster, creative, office, modal, readiness, career, and stylesheet implementations. Inspected the current app in an isolated local browser origin, including a new career, the required weekly briefing, match format/casting/finish screens, draft return, and the promo editor. Checked phone layout at 390 × 844 and the booking dashboard at 1440 × 1000. Inspected the actual OpenType name tables in all three bundled fonts.

Both existing suites passed:

- `node tests/game.test.cjs`
- `node tests/webapp.test.cjs`

This was not a complete live-show playthrough, VoiceOver audit, device keyboard test, or synchronization with the remote GitHub branch. Findings below distinguish observed behavior from proposed design choices.

## Recommended direction

Make the app feel like a professional booker's desk with a local wrestling poster identity. Keep the human caricature portraits, cream paper, navy ink, red accents, yellow selection markers, character voices, and four-segment structure. Use expressive typography for event identity and wrestler names, with quieter, consistently sized controls for managing the show.

The current staged match flow, explicit winner choice, explanatory opponent suggestions, separate saved drafts, direct participant/finish edits, and single-screen promo intents are strong foundations. Refine those systems instead of adding another booking stage.

## Prioritized improvements

| Priority | Finding and evidence | Recommended change | Main implementation locations |
| --- | --- | --- | --- |
| High | The CSS declares Barlow Condensed and DM Sans, but the files contain Nimbus Sans Narrow Bold, Nimbus Sans Regular, and Nimbus Sans Bold. The requested visual identity is therefore not what is actually rendered. | Bundle the intended font families, declare their real supported weights, and introduce display/body font tokens. | `style.css:1`, `fonts/`, `sw.js` |
| High | On the phone dashboard, stats and the full career panel appear before the event and all four booking slots. The same career panel takes a large full-width block on desktop. | Put the event, compact budget/status strip, and Tonight's card first. Collapse career details to a one-line milestone with an expandable panel; keep the full roadmap in Office. | `game.js:602`, `progression.js`, `career.css` |
| High | Casting repeats stage navigation, participant disclosure, format/change controls, a separate wildcard row, search/filter controls, and spotlight before the roster. At phone width, this puts most browsing below the initial view. | Combine the format and participant count into one compact summary. Put Wildcard beside search or in secondary tools. Show the selected participant names as short chips. Preserve the named Add button and preview-before-add behavior. | `booking.js:90`, `booking.css:15`, `booking.css:17` |
| High | In the observed earned-rematch route, selecting Sweeps makes the insurer the first Best fit opponent, although the qualifier requires a different opponent. `opponentFit()` scores rivalry and traits without the route's qualification requirement. | Add objective-aware explanations: “Qualifying opponent” or “Does not count toward Sweeps' qualifier.” Prefer eligible candidates when booking toward that objective, while preserving free choice. | `booking.js:4`, `stories.js:200`, Sweeps arc qualification logic |
| High | Drafts persist, but the dashboard's draft slot still says “+ Book segment.” Reopening a match draft starts at the first wrestler rather than the incomplete finish. Confirmed cards with pending edits largely communicate the distinction through the edit label and toast. | Use “Resume draft,” show selected names and missing choices, and reopen at the first incomplete stage. For edits to confirmed bookings, show “Confirmed booking · unsaved draft changes” with explicit Resume/Discard actions. | `game.js:608`, `game.js:610`, `booking.js:44`, `booking.js:48` |
| Medium | The finish screen uses large winner portraits before rules/finish, then optional presentation, title, and prop controls. The useful booking read is below those controls. | Keep the winner decision prominent but more compact on phones. Group Winner, Rules, and Finish together; put Presentation and Prop under optional controls, following the promo editor's existing pattern. Show a short outcome sentence near Save. | `booking.js:137`, `booking.css`, `multi.css` |
| Medium | Readiness mixes incomplete bookings, minimum-match requirements, promises at risk, and repetition advice in one list. The Run button is disabled without a nearby compact reason until the player reaches the lower checklist. | Separate “Required to run” from “Creative advice.” Add a persistent compact footer with booked count, budget, next required action, and Run show when ready. Link each issue to its actual field or story context. | `stories.js:170`, `stories.js:193`, `game.js:602`, `webapp.css` |
| Medium | Clear booking immediately removes the confirmed segment and its draft; no undo is implemented. Reordering rerenders the app without restoring focus to the moved card. | Add an Undo action after clearing, with the previous segment and draft held temporarily. After moving, retain focus on the moved segment's control and announce its new position. Keep the accessible Earlier/Later buttons even if drag handles are added. | `career.js:80`, `career.js:81` |
| Medium | The main roster renders all 38 cards without search/filter controls, while match casting already has them. Promo speaker selection is an alphabetical native select with long names and no freshness context. | Reuse roster search and sorting in the main roster. For promos, retain the simple editor and add a searchable speaker picker or a few suggested speakers with portraits and story/availability reasons. | `game.js:612`, `booking.js:177` |
| Medium | Heavy outlines, offset shadows, stamps, all caps, and arrows appear across many routine controls. Several metadata rules use 6–10px text. Many elements compete for attention at the same visual strength. | Reserve the strongest poster treatment for event identity and portraits. Use lighter dividers for routine panels, consistent button hierarchy, larger metadata, and restrained shadows. Use arrows for a specific action convention rather than every edit. | `style.css`, `bootleg.css`, `booking.css`, `career.css` |
| Medium | The generic modal explicitly removes `aria-labelledby` and does not assign a replacement label. Promo intent changes rebuild the editor, replacing the focused button. | Label each dialog from its heading, restore focus after close to the initiating slot, and keep focus on the selected promo intent after redraw. Use grouped radio semantics for mutually exclusive choices where appropriate. | `game.js:616`, `booking.js:177–179` |

## Typography specification

My preferred pairing is **actual Barlow Condensed + actual DM Sans**. This follows the existing design intent while supplying the missing fonts. The condensed display face suits a wrestling bill; the body face gives decisions, financial information, and longer character text a consistent reading rhythm. This pairing is a design recommendation, not an accessibility guarantee.

The Barlow author's repository documents three widths and nine weights: [Barlow source](https://github.com/jpt/barlow). DM Sans source and family history are documented in the [DM Fonts repository](https://github.com/googlefonts/dm-fonts); use a current distribution from [Google Fonts](https://fonts.google.com/specimen/DM+Sans) when implementing.

| Use | Face and weight | Suggested size/line height |
| --- | --- | --- |
| Event names and title identity | Barlow Condensed 800; italic selectively | 40–56px / 0.98–1.05 |
| Page headings | Barlow Condensed 700–800 | 32–40px / 1.08 |
| Wrestler names and section headings | Barlow Condensed 700 | 22–28px / 1.1 |
| Body copy and explanations | DM Sans 400 | 15–16px / 1.5–1.6 |
| Buttons and navigation | DM Sans 600–700 | 14–16px / 1.2–1.3 |
| Labels, status, and secondary metadata | DM Sans 500–600 | 12–13px / 1.4 |
| Money, attendance, ratings | DM Sans 600–700 with tabular numerals | 16–28px as hierarchy requires |

Use sentence case for instructions and controls. Keep uppercase/tracking for short event labels and small stamps. Avoid narrow display type for long rules explanations. Do not shrink decision-critical text to accommodate long wrestler names; wrap names and reserve enough height. Keep full names in previews and accessible names.

Implementation notes:

- Introduce `--font-display` and `--font-body`, plus a small spacing and type scale. Replace scattered hardcoded family strings incrementally.
- Current static font files are declared as broad weight ranges. Match static files to their actual weight, or supply genuine variable fonts and declare their supported ranges.
- Self-host web fonts and include them in the offline shell. Retain `font-display: swap`, explicit fallbacks, and the correct accompanying license files.
- Check long names, curly quotes, apostrophes, stars, currency, and numerals before changing the production fonts.
- Use actual controls and text to compare fonts; a poster specimen alone will not reveal wrapped buttons or crowded finish forms.

## Proposed booking experience

1. Open Book show directly onto this week's event and card. A compact strip shows `2/4 booked · 1/2 matches · cost $…`.
2. Choose Match or Promo in an empty slot. Resume incomplete drafts directly from that slot.
3. For a match, choose format, then cast using one compact participant summary and a searchable roster. Previewing remains separate from adding.
4. While casting, surface due promises and goal eligibility alongside fit reasons. “Already booked in segment 2” should be explicit.
5. Choose winner, rules, and finish. Expand optional presentation/prop choices only when needed. Interference reveals its required wrestler and motive.
6. Review a concise outcome: `Sweeps defeats [opponent] · Standard · Clean finish · Counts as his qualifier`, where supported by the actual game rules.
7. Save to the card and return focus/scroll to that segment. Provide a secondary “Book next slot” shortcut.
8. Show blocking requirements separately from creative warnings before Run show. Give draft edits an explicit status so the player knows which version will run.

## Delivery order and acceptance

**First pass:** correct the font assets and declarations, establish readable type sizes, bring the card above the full career panel, improve draft labels/resume, and add the earned-qualifier warning. These address the clearest observed problems.

**Second pass:** compress casting chrome, group finish essentials, add persistent readiness information, and make clear/reorder actions recoverable and keyboard friendly.

**Third pass:** unify roster discovery across screens, improve speaker selection, and consolidate duplicate/overriding style rules. The ten loaded stylesheets are not inherently a problem; repeated competing component rules make a consistent visual system harder to maintain.

Acceptance checks for implementation:

- At 390 × 844, the first booking slot is visible without scrolling past a full career explanation. Search and useful roster choices are visible together during casting.
- At 1440 × 1000, the card is the dominant workspace and career information remains available without a large introductory block.
- A partially cast match reopens at its missing step. A draft never silently replaces a confirmed booking.
- The Sweeps earned-route suggestion explains whether an opponent qualifies, without changing the player's winner or enforcing a particular card.
- Keyboard users retain a meaningful focus position after selecting an intent, adding a participant, saving, clearing/undoing, or moving a segment.
- Distinct UI states include hover, focus, previewed, added, booked, draft, unavailable, and invalid. Color is accompanied by labels or another visible cue.
- Verify at narrow widths, with enlarged text, and with the phone keyboard open. Measure contrast and check screen-reader announcements before claiming accessibility compliance.
- Run both existing test suites after runtime changes. Add focused regressions for qualification guidance, draft resume, and undo where implementation warrants them.
- For a release, bump every shell query version with `sw.js`. Preserve existing saves, archived results, roster IDs, original approved art, human-performer canon, and the portrait-only Liam gag.


## Implementation · 7.12

Implemented the booking layout, actual offline font families, readable control system, draft summaries/resume, qualifier guidance/ranking, recoverable clear/discard, focus restoration, roster discovery and promo speaker search/suggestions. Required fixes and creative advice are now distinct. Screenshots are in `docs/screenshots/booking-7.12-desktop.png` and `docs/screenshots/booking-7.12-phone.png`.

Verification covered an existing test career updating through Save & restart, draft resumption, participant replacement, a clean qualifying match, a targeted promo, clearing/undo, reordering, search/no-results, and focus after promo intent changes. Layout checks covered 320px, 390px, and 1440px widths without document horizontal overflow. Both automated suites pass, including the added interaction-state regressions and offline font/release checks. The shell remains approximately 4.8 MB. This is not a physical iPhone keyboard or VoiceOver certification.
