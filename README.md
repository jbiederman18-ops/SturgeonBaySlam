# Sturgeon Bay Slam: Rise to Supremacy

Build Wisconsin Wrestling Alliance from a community hall into a generational dynasty: four segments and 38 wrestlers who take their ridiculous gimmicks very seriously.

## Play locally

There are no dependencies or build steps. From this folder:

```sh
python3 -m http.server 5173
```

Open [the game](http://localhost:5173/index.html). Any static web host can serve this folder. For GitHub Pages, deploy the repository root. Runtime files do not make API calls or require accounts, keys, analytics, or a backend.

## Your first month

1. Resolve the weekly Little Snafu and listen to Sweeps backstage. Promise a fair rematch, make him earn it, or try an unlikely partnership with Term Life Insurance Plan. A second decision determines whether you keep the conversation private or publicize it.
2. Book four segments, including at least two matches. Choose the match format before casting. Select the winner, rules, finish and presentation; interference names a wrestler and a motive. A prop can support one segment each night.
3. Book a promo with an explicit target or address the audience. Choose a solo address, face-off, interview or interruption. Custom opening lines are optional and are performed as written; their wording is not scored.
4. Run the show. Your winner remains fixed, while live calls change trust, momentum, chemistry and stories as well as quality. Intent hints explain the tradeoffs before you choose.
5. Read what changed in the recap, then plan next week. Week four is the first stop on the Wisconsin tour. Promises have deadlines; a clean big-event result can settle a rivalry. Sweeps gets an aftermath whether you deliver the payoff or leave him waiting.

A clean qualifying win against someone other than the insurer unlocks Sweeps' earned rematch. For the partnership route, put Sweeps and the insurer on the same side of a tag match. Their debut can establish Sweepstakes & Deductibles when both are free to form a team.

## Stories and the booking desk

The desk forecasts costs and attendance, checks promises and flags repeated appearances. Story suggestions and roster sorting help you cast by purpose. Partial drafts save separately from the confirmed card; closing an editor retains the draft without replacing your confirmed booking. Clear a slot to discard both. Challenges can be booked or declined from the story board. Pencil in future beats without locking the card.

Rivalries remember a grievance, their latest incident and their phase. Named cheating, interference, targeted promos and live calls create those incidents. Cold stories lose heat. Only featured stories draw attendance. A promo followed by a match is useful; repeated speeches and unchanged matchups lose impact. Audience meters are independent satisfaction scores, with normalization and a 10–90 range.

Trust responds to promises and backstage choices. Momentum affects performance modestly. Very low morale has a small performance cost; a missed opportunity does not make recovery impossible. Generic backstage requests rotate after the spotlight arc. Weekly production decisions, props, team moments and character milestones give the community hall its own personality.

The booking desk tracks your next career milestone. The Office lets you choose a seasonal strategy and keeps full show stories, including a career retrospective every twelve weeks. Older imported history entries retain their available show totals. Playback preferences offer instant or typewriter text and concise or full scenes; the full performed dialogue remains in the log.

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

## iPhone and iPad Home Screen app

Open the hosted game in Safari, choose **Share → Add to Home Screen**, and leave **Open as Web App** enabled if offered. Open the installed app once while online and wait for **Ready for offline play**. The installation guide is available on the title screen and in the Office.

The app has its own icon, standalone manifest, safe-area spacing, touch-sized controls, 16px form text, keyboard-aware dialog height, portrait/landscape layouts, offline game/portraits/fonts, and a player-controlled update restart. Updates wait while a show or booking dialog is open. Careers are separate from the offline file cache and remain on the device.

If you already started in Safari, export from the Office and import inside the installed app; Safari and Home Screen storage may be separate. On browsers supporting file sharing, Export career opens the native share sheet so you can save a backup in Files; otherwise it downloads the JSON file. Storage is still subject to browser/device limits, so keep backups.

The six optimized JPEG portrait atlases total 3.17 MB, down from 15.00 MB (79% smaller). The full offline shell is about 4.45 MB. Original PNG art remains available as source, but is not loaded or cached during play.

Run the additional webapp checks with:

```sh
node tests/webapp.test.cjs
```

See [iOS implementation and testing notes](IOS-WEBAPP.md) and the [icon generation brief](icons/README.md). Before a future runtime release, update the version in `sw.js` and every `?v=` shell URL in both `sw.js` and `index.html` together. This keeps each offline release internally consistent.

## Monthly Wisconsin tour

Every fourth week takes the promotion to a different Wisconsin town. The 12-show circuit repeats after week 48; weekly cards begin at St. Elbow’s Community Hall in Sturgeon Bay. Career advancement unlocks larger venues while preserving the tour’s towns and event identities. Open **Office → Wisconsin tour schedule** to see the next twelve dates.

| Week in circuit | Monthly show |
| --- | --- |
| 4 | Sister Bay Shoreline Showdown |
| 8 | Fish Creek Fish Boil Brawl |
| 12 | Egg Harbor Scramble |
| 16 | Baileys Harbor Breakwater Bash |
| 20 | Algoma Pier Six |
| 24 | Kewaunee County Line Clash |
| 28 | New Glarus Swiss Slam |
| 32 | Mineral Point Hard Rock |
| 36 | Spring Green River Rumble |
| 40 | Viroqua Fairgrounds Fight Night |
| 44 | Manitowish Waters Last Call |
| 48 | Bayfield Breakup on the Bay |

Show posters, the upcoming-show panel, story deadlines, and new recaps use the scheduled town and venue. Towns are real; wrestling events and halls are fictional. Existing career results retain the names under which they were originally played. Tickets, capacity, and venue costs now grow with career advancement. Historical results preserve their original capacity.

Setting references: [Door County](https://www.travelwisconsin.com/places-to-go/door-county), [New Glarus](https://www.travelwisconsin.com/places-to-go/new-glarus), [Spring Green](https://www.travelwisconsin.com/places-to-go/spring-green), [Viroqua](https://www.travelwisconsin.com/places-to-go/viroqua), and [Bayfield](https://www.travelwisconsin.com/places-to-go/bayfield). Local details are fictional wrestling-show flavor, not real event listings.

## Little Snafu: weekly business

Every new week starts with a required briefing before booking. Resolve the production problem, answer the backstage request and choose whether to keep that conversation private or public, then review your promises and open challenges. The final button opens the booking desk. Escape and backdrop clicks do not skip the briefing; Return to title pauses it. Your choices and progress survive closing or reloading the app.

Twenty problems rotate, including: dead entrance-music phone, missing announcer, damaged backdrop, missing chairs, novice referee, wrong-town posters, a double-booked hall, a missing microphone, a malfunctioning scoreboard, and a late entrance-set delivery. A paid fix adds $40 to show costs; an improvised fix changes the relevant segment by +2 or −2 according to its performers; the simple free workaround costs 1 quality. The referee problem applies to the first match, even after an opening promo. The hall deadline applies to the main event.

Backstage replies can create dated booking promises or advance Sweeps' story. Declining a request is allowed; accepting it is not required to continue. Completed responses cannot grant trust or momentum twice. A summary remains on the booking desk under Review this week, and the show recap records the production outcome and backstage decision. Existing careers can finish an in-progress show or recap before the new flow begins. Existing one-night production choices and completed requests are retained.

The state and flow are implemented in `snafu.js` and `snafu.css`, using the shared story and simulation systems.

### Touch booking and opponent suggestions

On phones, booking uses Format → Wrestlers → Finish, a collapsible participant list and a two-column roster. Preview a wrestler, then use the named Add button to confirm. Done for now and close both preserve the draft; Save match confirms changes to the show card.

Tap a wrestler on a saved match to replace that participant, or tap the match’s rules, finish, winner or prop indicator to edit those settings. Other choices remain in the draft, and validation still applies before saving. Best fit sorts possible opponents using existing rivalries and challenges, face/heel contrast, ring and microphone skills, and comparable popularity. Each suggestion explains its reasons; these are booking aids rather than extra rating bonuses.

## Character content update (7.7)

Weekly production problems now rotate through twenty scenarios. Every wrestler has two additional authored live promo choices (five total), a five-opening promo rotation, and a character-specific backstage invitation that can promise a promo after the opening Sweeps arc.

When casting a match, each participant unlocks their signature match in Match type (excluding battle royals). These are character showcases with standard pinfall/submission rules and a $120 setup cost; the live introduction features the owner's character routine. They do not override the booked winner or finish. For example, Sweeps offers Clean Sweep Challenge and the insurer offers Coverage Denied Clash.

Each wrestler also brings a free signature presentation prop. It appears when its owner is cast, adds one momentum to that owner, and is mentioned in the recap. Each prop can be allocated once per show. Existing shared props retain their effects.

The original [seasonal-goal brainstorm](SEASON-GOALS-BRAINSTORM.md) records the early proposal. The implemented career ladder is documented below.


## Rise to Supremacy career (7.8)

Your first ambition is to sell out St. Elbow’s 300-seat hall by the end of season one. A season lasts twelve weeks. If you fall short, your progress carries forward; you keep pursuing the milestone. One chapter can be awarded at each season-end review, and earned chapters are permanent.

The eight chapters are Local curiosity → Hometown institution → Wisconsin draw → Regional contender → Cult phenomenon → National promotion → Industry leader → Generational dynasty. Each chapter displays its exact requirements on the booking desk and in the Office. Higher chapters offer alternative routes through ring quality, audience loyalty, or story delivery. The final chapter requires sustained success across at least three three-season eras, three different champions, and a broad featured roster.

Venue capacities progress through 300, 600, 1,200, 2,500, 5,000, 8,000, 15,000 and 30,000 seats. Operating costs and ticket prices increase. Earning the regional broadcast pays $3,000 per show; earning national TV pays $25,000; reaching the stadium circuit pays $60,000. Income is included in both forecasts and actual profit. Attendance responds to reputation, featured stars/stories, monthly events, and recent good shows, scaled to your current venue.

Choose a seasonal strategy in the Office: free booking, stars, stories, teams, or business. Change it anytime. It provides transparent counters and appears in your season retrospective, but never dictates winners or gates career advancement. The full roadmap is available under The road to supremacy. Dynasty completion leaves the career open for continued play.

Existing saves retain cash, roster, shows, stories, and current play state. Their new career ladder starts measuring from the week the update is adopted; earlier seasons are not retroactively reassessed. Old backup names remain importable, and new backups use the full Rise to Supremacy name. `progression.js` owns the ladder, strategy tracking, venue economy and retrospectives. The offline shell is version 7.8.

Verification includes automated paths for all eight milestones, duplicate-review protection, failed seasons, legacy migration, backup validation, first-season sellout feasibility, and actual TV payments. Desktop and 390-pixel mobile Office screens and strategy persistence were checked in-browser. These checks do not replace a full multi-season economy playtest.

## Roster expansion (7.9)

The roster now has 38 human performers. Liam Neesen is a grave action veteran; The Tooth is a powerhouse in a foam molar costume; “Allowed Elsewhere, Choosing to Be Here” Tessa Blanchard insists her appearances are entirely voluntary; A Dog That The Rules Don't Say Is Banned is a human wrestler in dog-themed gear insisting he is a dog and arguing the rules never say dogs cannot wrestle. Each has a portrait, authored voice, five promo choices, signature match and signature prop. Existing 34-wrestler careers and backups gain the four without resetting progress.

**Hard canon:** every wrestler is a person performing a character. Animal, object and food names are gimmicks and costumes. Portraits, prose and future additions must preserve human performers. Characters stay completely committed to their gimmicks in dialogue; the human-performer rule guides their actual depiction. Both rules are recorded in `AGENTS.md`.

## Booking polish (7.10)

Promo booking uses a single screen: choose the speaker, then Rally the room, Call someone out, Make it personal, or Show the character. Only targeted beats require an opponent. Presentation, custom opening lines and props remain under optional controls. Closing saves a draft without replacing the confirmed segment.

The match-rules selector now calls ordinary rules **Standard** across every format, including battle royals. Existing saves retain their original rule values and behavior. Expansion portraits use tighter framing to match the original cast, and compact roster cards use bounded name areas; Tessa's full nickname remains in previews and character details.

## Reference-matched expansion art (7.11)

The four expansion portraits now use square Cut-Paper Misfits caricatures conditioned on the approved atlas images. Original identities and gimmick details are preserved. `docs/WRESTLER_ART_STYLE_GUIDE.md` contains the supplied art direction; `art/source/expansion-v2/` retains native PNGs, prompts, reference filenames and hashes. The game loads 512px JPEG exports with stable ID mappings and the same centered portrait crop as the original cast. All original approved atlases remain unchanged.
