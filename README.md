# Sturgeon Bay Slam

Run Wisconsin Wrestling Alliance: four segments, a community hall, and 34 wrestlers who take their ridiculous gimmicks very seriously.

## Play locally

There are no dependencies or build steps. From this folder:

```sh
python3 -m http.server 5173
```

Open [the game](http://localhost:5173/index.html). Any static web host can serve this folder. For GitHub Pages, deploy the repository root. Runtime files do not make API calls or require accounts, keys, analytics, or a backend.

## Your first month

1. Listen to Sweeps backstage. Promise a fair rematch, make him earn it, or try an unlikely partnership with Term Life Insurance Plan. A second decision determines whether you keep the conversation private or publicize it.
2. Book four segments, including at least two matches. Choose the match format before casting. Select the winner, rules, finish and presentation; interference names a wrestler and a motive. A prop can support one segment each night.
3. Book a promo with an explicit target or address the audience. Choose a solo address, face-off, interview or interruption. Custom opening lines are optional and are performed as written; their wording is not scored.
4. Run the show. Your winner remains fixed, while live calls change trust, momentum, chemistry and stories as well as quality. Intent hints explain the tradeoffs before you choose.
5. Read what changed in the recap, then plan next week. Week four is the potluck. Promises have deadlines; a clean big-event result can settle a rivalry. Sweeps gets an aftermath whether you deliver the payoff or leave him waiting.

A clean qualifying win against someone other than the insurer unlocks Sweeps' earned rematch. For the partnership route, put Sweeps and the insurer on the same side of a tag match. Their debut can establish Sweepstakes & Deductibles when both are free to form a team.

## Stories and the booking desk

The desk forecasts costs and attendance, checks promises and flags repeated appearances. Story suggestions and roster sorting help you cast by purpose. Partial drafts save separately from the confirmed card; closing an editor retains the draft without replacing your confirmed booking. Clear a slot to discard both. Challenges can be booked or declined from the story board. Pencil in future beats without locking the card.

Rivalries remember a grievance, their latest incident and their phase. Named cheating, interference, targeted promos and live calls create those incidents. Cold stories lose heat. Only featured stories draw attendance. A promo followed by a match is useful; repeated speeches and unchanged matchups lose impact. Audience meters are independent satisfaction scores, with normalization and a 10–90 range.

Trust responds to promises and backstage choices. Momentum affects performance modestly. Very low morale has a small performance cost; a missed opportunity does not make recovery impossible. Generic backstage requests rotate after the spotlight arc. Optional production calls, props, team moments and character milestones give the community hall its own personality.

The office tracks optional season goals and keeps full show stories, including a retrospective every twelve weeks. Older imported history entries retain their available show totals. Playback preferences offer instant or typewriter text and concise or full scenes; the full performed dialogue remains in the log.

## Save and continue

Progress saves automatically in this browser on this device. Continue career resumes the desk, a live show or its recap. Returning to the title does not reset progress.

Use **Office → Export career** for a JSON backup and **Import career** to restore one. Original Sturgeon Bay Slam and Brawl in Boseman backups migrate to the story system without resetting cash, roster, teams or history. New careers replace the current local save after confirmation. Browser storage is local; export before clearing it or moving domains.

## Files

- `game.js`: roster, main screens, career bootstrap.
- `stories.js`, `stories.css`: story memory, promises, Sweeps' branching arc, planning, props, requests, production and fallout.
- `booking.js`, `booking.css`: casting, drafts, targets, interference and review.
- `matches.js`: formats, economy, audience, simulation and persistent live consequences.
- `moments.js`, `kayfabe.js`, `exchange.js`: character decisions, performed scenes and playback.
- `career.js`, `career.css`: title, validation, migration and portable backups.
- `portraits.js`, `art/`, `fonts/`: existing character artwork and typography.
- `tests/game.test.cjs`: dependency-free engine regressions and twelve-week balance comparisons.

## Verify

```sh
node tests/game.test.cjs
```

The tests exercise legacy migration, backup validation, live-show resume, promise fulfillment/failure, all three Sweeps routes and missed payoffs, challenges, named interference, live effects, every supported match format/ruleset/winner and all character voices, season history, prop/title constraints and repetition incentives.

Browser verification covered a complete four-segment show into week two, saved draft and live-choice reloads, a targeted promo, named interference, an earned rematch, the planning board, playback preferences, and 320/390/768/1440-pixel layouts. It is not an exhaustive accessibility audit or a long-term balance study.
