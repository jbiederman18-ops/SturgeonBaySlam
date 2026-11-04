# Kayfabe artwork and icon · version 7.46

- Recreate the Home logo and screen headers with live lettering and vector shapes, replace the cropped texture, and match the install icon to the new poster design.

# Kayfabe Promotions · version 7.45

- Recast the game in red, black, yellow, and newsprint with a new weekly Home screen, compact mobile roster, and matching booking, backstage, and recap screens.
- Add match control dials and booking stamps, blend the Home logo into the background, and make the booking footer open the next draft or backstage task.

# Saturday Night Blowout · version 7.37

- Bring pink and cyan overprint, diagonal portrait crops, and stacked billing to the title, booking, roster, Creative, Office, live show, results, and install icons.

# The booker’s desk · version 7.30

- Book directly on the show poster, with separate pencil drafts and a public print proof.
- Handle venue messages and wrestler requests alongside the bill. See which promises your bookings fulfill and how a draft changes the forecast.
- Call the show from a private running order, then pencil a follow-up into next week’s notes.
- Compare your current room with a promotion offer before taking on a bigger venue and its costs.

# Booking desk · version 7.12

- Put the show card first, with a compact status strip, expandable career milestone, and persistent budget/next-action controls.
- Bundled genuine Barlow Condensed and DM Sans WOFF2 fonts and introduced a shared readable type/control system.
- Added draft summaries, resume at the first unfinished match step, explicit pending-edit status, and undo for clearing bookings or discarding drafts.
- Added earned-qualifier guidance and ranking, compact casting controls, and optional finish presentation/props.
- Added roster search/filter/sort, promo speaker discovery, named dialogs and focus restoration.
- Split required booking fixes from creative advice; preserve all existing save, history, roster and simulation rules.

# Story update · version 4

- Added persistent story incidents, rivalry phases, trust, momentum and meaningful live consequences while preserving player-booked winners.
- Added Sweeps' four-week branching story, dated promises, earned rematches, unlikely partners and aftermath scenes.
- Added explicit promo formats/targets, optional custom lines, open challenges, named interference and separate result presentation.
- Reworked casting to start with format, retain separate drafts, sort by purpose, and show booking readiness and budget forecasts.
- Added an editable four-week plan, rotating backstage requests, optional production calls, three distinct props, two character milestones, season goals and retrospectives.
- Rebalanced repeat exposure, featured-story attendance, popularity gains, gimmick debuts and audience satisfaction.
- Added remembered playback options, preserved decision labels, story-first recaps and durable show history.
- Kept legacy save compatibility and added dependency-free regression coverage.

No new assets, third-party dependencies, backend services or deployment are required. The original extracted source remains in `source-review/` for comparison and is excluded from the release archive.

# iOS webapp update · shell v5.2

- Added an original folding-chair Home Screen icon, iPhone/iPad sizes, favicon, standalone manifest and Safari metadata.
- Added a complete offline shell, scope-safe cache cleanup and player-controlled updates that wait during shows/editing.
- Added safe-area and landscape navigation spacing, touch-sized controls, 16px inputs and keyboard-aware dialogs.
- Reduced portrait transfer by 79% with optimized JPEG atlases; original PNG source is retained.
- Added installation/backup guidance, native file sharing when available, background saving, duplicate-write suppression and persistent storage-failure warnings.
- Added offline, icon, scope and update regression coverage. Physical iPhone/iPad Safari smoke testing is still needed.

# Wisconsin tour and copy update · shell v6

- Replaced the recurring Potluck show with a 12-stop Wisconsin circuit, rotating every four weeks through week 48 and repeating for continued careers.
- Added town-specific show names, fictional halls, local details, poster accents, and an upcoming tour schedule in the Office.
- Connected show previews, story conversations/deadlines, and future recaps to the scheduled town. Past career results keep their original names.
- Removed the title-screen slogans and roster burst; simplified navigation, booking, roster, creative, recap, and install copy while retaining character dialogue.
- Preserved ticket prices, venue capacity, financial rules, and existing saves. Added calendar rollover, recap identity and migration checks.

# Little Snafu · shell v7.2

- Added a required start-of-week briefing: production problem, backstage response, conversation tone, and booking reminders before the desk opens.
- Expanded production to ten local-wrestling problems with paid, improvised and basic-workaround choices, all reflected in the show budget and recap.
- Saved partial/completed briefings, locked already-resolved decisions, and made response effects idempotent across reloads and repeated submissions.
- Kept in-progress shows/recaps uninterrupted and migrated existing production decisions and backstage replies.
- Added a read-only weekly summary, accessible modal steps, title-screen pause, and mobile-safe scrolling. Updated offline resources and regression coverage.

## Mobile booking and opponent fits · shell v7.6

- Replaced the crowded participant step bar with Format, Wrestlers and Finish stages, plus a collapsible participant summary.
- Added a full-screen phone editor, two-column touch roster and one named Add action. Drafts save through Done for now or close.
- Saved show cards now open the relevant participant, stipulation, finish, winner or prop editor directly. Replacing a participant returns to review when the lineup is full; replacing the winner requires choosing a valid winner again.
- Best fit sorting explains opponent recommendations using alignment, ring and mic skills, popularity, rivalry heat and open challenges. Tag teammates are excluded from opponent comparisons. Suggestions do not grant hidden bonuses.

## 7.7 — Character content expansion

- Twenty rotating Little Snafus, up from ten.
- Two additional authored live promo branches per wrestler, five opening lines, and character-specific backstage promo offers.
- Thirty-four participant-unlocked signature match presentations and thirty-four owner-bound signature props.
- Signature matches preserve standard pin/submission finishes and booked outcomes; props grant owner momentum without a rating bonus.
- Offline shell updated atomically to 7.7; expanded engine regression coverage across all characters.
- Seasonal creative-brief proposal documented separately for discussion; current goal behavior unchanged.


## 7.8 — Sturgeon Bay Slam: Rise to Supremacy

- Eight permanent career chapters, from selling out the local hall to a generational dynasty, reviewed every twelve weeks with unfinished progress retained.
- Player-chosen seasonal strategies and progress on the booking desk, full roadmap in the Office, archived season ambition reports.
- Larger venues, scaled attendance and operating costs, regional/national broadcast income, and historically accurate capacities in recaps.
- Renamed title, desktop branding, manifest and new backups; legacy backup names and save keys remain supported.
- Progression import validation, new end-to-end engine regressions and atomic 7.8 offline release.
- Fixed portable backups rejecting the new character backstage promo choice.

## 7.9 — Four new human performers

- Added Liam Neesen, The Tooth, “Allowed Elsewhere, Choosing to Be Here” Tessa Blanchard, and A Dog That The Rules Don't Say Is Banned (stable IDs 34–37).
- Added four cut-paper portraits, character voices, crowd responses, signature matches, props and branching promos.
- Characters stay fully in gimmick: the Dog insists he is a dog and demands the rule that bans dogs from wrestling.
- Established the permanent human-performer canon in AGENTS.md, data, migration and regression checks. The Tooth and Dog are people in costumes.
- Preserve 34-person backups and add the expansion without resetting career progress. New portraits join the 7.9 offline shell.

## 7.10 — Faster promo booking and consistent roster cards

- One-screen promo editor with four intent choices, conditional targets, optional presentation/line/prop controls, and saved drafts.
- Standard rule label across match formats, preserving legacy save values and simulation behavior.
- Tighter expansion portrait framing and bounded roster-card names; compact Tessa name with full identity retained in previews.
- Updated offline shell and regressions for rule labels, promo target requirements and speaker changes.

## 7.11 — Reference-matched expansion artwork

- Rerendered Liam Neesen, The Tooth, Tessa Blanchard and the Dog using their existing identities plus the actual approved Cut-Paper Misfits atlas images.
- Square caricature compositions with larger heads, simpler eyes, broad paper shapes and matching cream backgrounds.
- Preserved native 1254px sources, prompts, reference manifest and 512px runtime exports; explicit standalone mappings keep IDs stable.
- Verified original atlas hashes and phone-sized roster, casting and dialogue crops. Updated the offline shell to load the rerenders.
