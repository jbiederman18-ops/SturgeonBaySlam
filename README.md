# Sturgeon Bay Slam: Rise to Supremacy

Build Wisconsin Wrestling Alliance from a community hall into a generational dynasty: four segments and 38 wrestlers who take their ridiculous gimmicks very seriously.

## Play locally

There are no dependencies or build steps. From this folder:

```sh
python3 -m http.server 5173
```

Open [the game](http://localhost:5173/index.html). Any static web host can serve this folder. For GitHub Pages, deploy the repository root. Runtime files do not make API calls or require accounts, keys, analytics, or a backend.

## Your first month

1. If you've sinned, answer to the Good Lord Above. Broken promises and loose talk bring an act of God down on the show, and how you take it moves your standing with Him.
2. Book four segments, including at least two matches. Tap any space on the card and a sheet slides up with the best fits for that spot, each with a one-word reason (promises and obligations first, under “Needs you tonight”). One tap books the wrestler and the sheet moves to the next space; tag and trios fill a whole team before the opponents. Pick the shape (singles, tag, trios, triple threat, four-way, battle royal or promo) at the top of the sheet anytime. Set the winner with the 👑 under each side, and the pin-taker when two or more lose. Stipulations, the title, presentation and props are in the sheet's Stips & titles view; finishes and run-ins stay in Details. Tap a booked wrestler to replace them; hold and drag to move or trade them, drop off the card or flick sideways to send them back, and hold a segment's name to reorder (the last segment is the main event). Half-built segments stay drafts until they are legal, then join the card. Suggest the rest fills empty spaces from traits alone and leaves every winner to you. A prop can support one segment each night.
3. Book a promo with an explicit target or address the audience. Choose a solo address, face-off, interview or interruption. Custom opening lines are optional and are performed as written; their wording is not scored.
4. Run the show. Your winner remains fixed, while live calls change trust, momentum, chemistry and stories as well as quality. Intent hints explain the tradeoffs before you choose.
5. Read what changed in the recap, then plan next week. Week four is the first stop on the Wisconsin tour. Promises have deadlines; a clean big-event result can settle a rivalry. Sweeps gets an aftermath whether you deliver the payoff or leave him waiting.

A clean qualifying win against someone other than the insurer unlocks Sweeps' earned rematch. For the partnership route, put Sweeps and the insurer on the same side of a tag match. Their debut can establish Sweepstakes & Deductibles when both are free to form a team.

## Stories and the booking desk

The desk forecasts costs and attendance, checks promises and flags repeated appearances. Story suggestions and roster sorting help you cast by purpose. Partial drafts save separately from the confirmed card; closing an editor retains the draft without replacing your confirmed booking. Clear a slot to discard both. Challenges can be booked or declined from the story board. Pencil in future beats without locking the card.

Rivalries remember a grievance, their latest incident and their phase. Named cheating, interference, targeted promos and live calls create those incidents. Cold stories lose heat. Only featured stories draw attendance. A promo followed by a match is useful; repeated speeches and unchanged matchups lose impact. Audience meters are independent satisfaction scores, with normalization and a 10–90 range.

Trust responds to promises and backstage choices. Momentum affects performance modestly. Very low morale has a small performance cost; a missed opportunity does not make recovery impossible.  Weekly production decisions, props, team moments and character milestones give the community hall its own personality.

The booking desk tracks your next career milestone. The Office lets you choose a seasonal strategy and keeps full show stories, including a career retrospective every twelve weeks. Older imported history entries retain their available show totals. Playback preferences offer instant or typewriter text and concise or full scenes; the full performed dialogue remains in the log.

## Five eras (7.50)

The eight chapters now group into five eras. Each era changes what the booker does, not only the numbers:

| Era | Chapters | Card | Fix cost | Rival | New job |
| --- | --- | --- | --- | --- | --- |
| I · The Gym Years | 1–2 | 4 | $40 | Door County Grapple Club | You handle every problem yourself |
| II · The Circuit | 3 | 5 | $150 | Fox Valley Championship Wrestling | Hire a ring crew and a road agent |
| III · The Territory | 4–5 | 6 | $600 | Great Lakes Wrestling Federation | Stations, cameras and poachers; a production manager |
| IV · The War | 6–7 | 7 | $2,500 | Apex Pro Wrestling | The writers' room drafts your undercard |
| V · Supremacy | 8 | 7 | $8,000 | Apex Pro Wrestling | Defend #1 and the town that built you |

Every chapter adds a rival goal: win a head-to-head tour night or average a bigger crowd than the rival. Rivals book your town on monthly tour nights; choose to go head to head, move the show, or raid their card. Crew members resolve their department's weekly problem automatically for a per-show salary. Moving between eras opens Moving Day, where you pick traditions that pay off for the rest of the career. `rise.js` owns eras, rivals, standings, crew, press calls, traditions and the writers' room; `poster.css` is the Boxing Window Card theme.

## The week ahead (7.57)

Each week ends its briefing with three invitations from the featured cast and two free evenings. Spend an evening and you get a short scene in that wrestler's world. Play along with their reality and they warm up; break it and they remember. Featured wrestlers hide their trust number: read their tells instead. Sweeps McKenzie's route runs from his after-hours sweeping to the Ask, a title match on a floor he has swept for twenty-four hours. Every payoff lands on the booking sheet, and the promise ledger on the Decisions page keeps your word in writing.

## Save and continue

Progress saves automatically in this browser on this device. Continue career resumes the desk, a live show or its recap. Returning to the title does not reset progress.

Use **Office → Export career** for a JSON backup and **Import career** to restore one. Original Sturgeon Bay Slam and Brawl in Boseman backups migrate to the story system without resetting cash, roster, teams or history. New careers replace the current local save after confirmation. Browser storage is local; export before clearing it or moving domains.

## Files

- `game.js`: roster, main screens, career bootstrap.
- `stories.js`, `stories.css`: story memory, promises, Sweeps' branching arc, planning, props, requests, production and fallout.
- `booking.js`, `booking.css`: segment plates, the Details editor (one sheet), drafts, targets, interference and review.
- `routes.js`: relationship dialogue and route data only (scenes, tells, invites, sign-offs, Sweeps' story). No logic.
- `relationships.js`, `relationships.css`: the relationship layer engine. Featured routes, The week ahead (evening invitations and cutscenes), hidden affection read through tells, play-along reputation, Sweeps' full route, the promise ledger and window cards. Save fields migrate in `career.js` (`migrateRelationships`).
- `pick.js`, `pick.css`: the tap-to-pick sheet, Best fit ranking and reason tabs, crowns and pin-taker, drag to rearrange, and Suggest the rest. `docs/BOOKING-PORT.md` is the design brief.
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

## Acts of God: the Good Lord Above

Little snafus come from the Good Lord Above, as punishment. He keeps a file on you: every broken promise, every reply that gets back to the wrestler you talked about, and every time you blame a wrestler for His work. A broken promise or a scapegoat always brings a visit the following week. The little sins add up: when He's Watching or Displeased two of them bring Him down, when Pleased or Beaming three, and when Wrathful just one. A clean file means no snafu at all.

He checks in on the cutscene player the first time you look at the week, reads you the charges, smites the show (one of the era's production problems) and asks how you'll take it:

- **Thy will be done. We'll make do.** Free; the affected segment loses 1 quality. His favor +6.
- **I'll make it right, whatever it costs.** The paid fix goes on the show budget; no quality lost. Favor +2. Wrathful, He wants double in the plate.
- **Watch me turn this into a bit.** Free; the segment gains or loses 2 quality depending on its performers. He watches from the cheap seats: favor +3 if it lands, −6 if it flops.
- **That was (a wrestler)'s fault, actually.** Free, no quality lost, but that wrestler loses 8 trust and 4 morale, His favor drops 12, and the lie goes in His file.

His mood runs Wrathful, Displeased, Watching, Pleased, Beaming. It sets how much He lets slide, and it moves the gate: a Beaming Lord fills a few more seats, a Wrathful one empties some. The Decisions tab shows His mood, this week's judgment and what's in His file. A hired crew can still quietly fix acts of God in their department; He allows it. Easy mode shows what each answer does to His favor.

The drama of the show is the point of booking: finishes, cheating and run-ins never count, for Faces or Heels. Booking only counts when it reaches life outside the ring (promises, working someone three times in a night, giving someone their spot back).

### The Ledger

Alongside the weekly file He keeps a silent ledger of your character, naughty and nice, that you never see (easy mode shows a rough lean on the Decisions tab). Nice: keeping promises (+2), "Thy will be done" (+3), paying to make things right (+1, +2 more when it's people, not equipment), the honest answer (+1), showing up for an "Only this week" evening (+2), bringing someone back after three weeks away (+1), someone warming to you (+1), protecting the locker room from the celebrity (+3), a generous tradition (+3), winning a territory night fair (+1). Naughty: broken promises (−4), blaming a wrestler (−5), words that get back (−2), brushing someone off (−1), a bit that flops (−1), raiding (−3), the celebrity (−3), working someone three times in a night (−1), promising more than the card holds (−2). Small habits are capped each week.

He reads it twice an era: a **check-in** halfway through (only if you lean clearly one way) and a **reckoning** on moving day, before the epilogue reel. The verdict is the per-week average: +0.75 or better is a gift, −0.75 or worse a punishment, anything between is Lukewarm (no gift, just a look). His favor sets the size: Pleased or better gives two gifts, Displeased or worse two punishments. A quarter of each era carries into the next. Gifts: cash, forgiveness, a blessed card, a packed house, a locker-room blessing, a halo, grace. Punishments: empty chairs, a cursed card, a tithe taken, a locker room that's heard everything, an unprompted act of God, a blessed rival. After the dynasty, He reckons every season.

Claiming the legacy plays the final judgment over the whole career: **Ringside, forever** (best), **Folding chairs, forever** (neutral) or **The deepest pit of oblivion** (bad). The career continues either way, and the ending can be rewatched from the Decisions tab. The ledger lives in `ledger.js`.

**Jesus drops hints.** After some shows, Jesus waves you over at the punch bowl with a hint about which way the ledger is leaning ("I tried to put in a good word for you upstairs. There was a long pause."). He speaks up when the ledger turns, when it's been four weeks, or when a visit from above is coming. The hint appears on the after-show screen and at the end of the backstage walk.

The old venue email and smoke-break request are retired. Saves mid-briefing keep their production call, and the Sweeps fair-shake month only continues for careers that started it.

The state and flow are implemented in `snafu.js` and `snafu.css`, using the shared story, simulation and cutscene systems.

### One-sheet match booking and opponent suggestions

Every match decision lives on one screen. Format chips sit at the top, then the corners. The open corner is highlighted and the Best fit strip below fills it with a single tap; hold a card to preview the wrestler first. Pick to win sits under each corner. Finish, run-in wrestler and motive, rules and the title are chips, never menus. Presentation and prop stay under an optional section. A sticky footer shows crowd heat, what's still missing and Book it. Done for now keeps the draft without replacing the confirmed card.

Tap any spot on the poster to open its sheet with that spot ready to cast, or tap a wrestler on the sheet to recast that corner. Validation still applies before saving. Best fit sorts possible opponents using existing rivalries and challenges, face/heel contrast, ring and microphone skills, and comparable popularity. Each suggestion explains its reasons; these are booking aids rather than extra rating bonuses.

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

## Booking desk and typography (7.12)

The show card now leads the booking screen, with compact budget/readiness controls and expandable career progress. Actual Barlow Condensed and DM Sans web fonts are bundled for offline play. Required booking fixes are separate from creative advice.

Resume draft returns to the first unfinished match step. Draft summaries name the wrestlers and missing choices; pending edits remain separate from the confirmed card. Clearing a booking or discarding edits offers a session-only Undo action, available until the card changes again. Earlier/Later controls preserve the moved segment's focus and move its draft with it.

Sweeps' earned-rematch route explains which opponents count as qualifiers. This changes suggestions and guidance, not simulation rules or booked winners. Finish essentials stay visible while presentation and props are optional. The roster has search, role/freshness filters and sorting; promo speakers have search and suggestions. Dialogs have accessible titles and promo intent choices retain focus.

Both automated suites include new regression coverage for draft resume, qualifier guidance, undo isolation, draft movement, roster discovery, font precaching, and release version consistency. Original art, roster IDs, careers and archived results are preserved.
