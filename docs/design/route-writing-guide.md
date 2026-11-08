# Route writing guide

Field reference and writing checklist for a featured route (Era II onward: Terrible Towel, Lemon Tart, then Maddox Hatter and Terry Pudding). Merged from the reading-the-room handoff (engine 7.70, dialogue 7.71) and the after-show handoff (engine 7.72, dialogue 7.73). All eight Era I routes are done. Everything goes in `routes.js`; its FORMAT comment documents every field.

## Rules
- 100% kayfabe. The tests scan every route string (mood tells, `stale`, `heard`, case reactions, `backstage`) for `costume|performer|real name|not really a|gimmick`.
- Never unmask the Dog. Liam's visual gag stays portrait-only: tests reject `wet|urine|stain|piss|accident` anywhere in his route.
- No player–wrestler romance. The Grinch → Lemon Tart crush is the one romance subplot (era-gated, live in Era II).
- Every scene keeps at least one reply with no promise (tests enforce it).
- Test every line: could another wrestler say it? If yes, rewrite it.

## Reading the room (evenings)
- **Moods.** The week after a loss (`low`) or a win (`high`), a wrestler can want a different style. The mood's `tell` replaces their opening tell. Every `high` mood keeps the usual style, so a win changes only the tell.
- **Repetition.** The same style to the same wrestler three times running lands at half. A `breaks` or `truth` reply resets the streak.
- **Reputation.** Each wrestler `distrusts` one style. If your most-used style overall is that one, everything lands 2 softer.
- **Hard truths.** `truth:true`: −2 trust, +4 morale, no sore.
- **Cases.** `cases:[{when, delta?, reaction?, morale?, sides?}]`; first matching WHEN wins. Keys: `lostLastShow`, `wonLastShow`, `champion`, `eventWeek`, `beatenByCheat`, `cheatedLastShow`.
- **Sides.** `sides:{id:delta}`. Negative means they hear about it, and their `heard` line plays next evening.
- Promise costs show on reply buttons. The window card names a style only in easy mode.

| Wrestler | Usual | After a loss | Distrusts |
|---|---|---|---|
| Greek | Hype | Believer | Bureaucrat |
| 2 Holds | Straight | Believer | Hype |
| Sweeps | Believer | Straight | Bureaucrat |
| Charming | Bureaucrat | Believer | Straight |
| Grinch | Hype | Believer | Straight |
| Ron | Bureaucrat | Straight | Hype |
| Liam | Straight | Bureaucrat | Hype |
| The Dog | Believer | Hype | Bureaucrat |

Supporting wrestlers' rows are in `roster.js`.

## After the show (the backstage walk)
The overview shows headline, gate, heat, match of the night, A–D grades and promises kept or broken. "Head backstage" is free. Up to four wrestlers come to you, biggest moment first: on the card in the back hallway, off it in the parking lot. A sore wrestler walks past (`skip`). Featured and supporting wrestlers share the four slots (`routeFor(id)`), with a catch-up nudge of +4 per week since they last came over, capped at +20.

| Kind | Fires when | Weight | `{name}` is |
|---|---|---|---|
| `broken` | A promise to them broke tonight | 90 | promise target |
| `lostToCheat` | Beaten by a cheating finish (supporting) | 85 | opponent |
| `stole` | Match of the night, graded A | 80 | opponent |
| `kept` | A promise to them was kept | 65 | promise target |
| `benched` | Off the card while a rival worked | 60 | the rival |
| `flat` | A segment graded D | 55 | opponent |
| `lost` | Lost (+25 vs rival, +10 title) | 50 | opponent |
| `won` | Won (+25 vs rival, +10 title) | 45 | opponent |
| `idle` | Off the card 4+ weeks (week 4 on) | 35 | — |
| `cutIn` | Their rival is in the walk; they interrupt | — | the rival |
| `skip` | Sore with you (one narration string) | — | — |

```js
backstage:{
 lost:{tell:'…', line:'“…”', replies:[
  {style:'believer', text:'“…”', reaction:'…'},
  {style:'hype', promise:'rematch', text:'“…{name}…”', reaction:'…'},
  {truth:true, text:'“…”', reaction:'…'}
 ]},
 skip:'{speaker} walks past …'
}
```
- Placeholders: `{name}`, `{speaker}`, `{promise}` (use in `broken`/`kept`).
- Promises default to next week (`due:1`). `rematch`/`team` target `{name}`; `promo`, `appearance`, `win`, `title` need none.
- What lands tonight: `moods.low.style` after a loss, `moods.high.style` after a win, else usual.
- Walk WHEN keys: `wonTonight`, `lostTonight`, `cheatedTonight`, `champion`, `minTrust`, `eventWeek`, `notEventWeek`.
- Rivals for `benched`/`cutIn` come from `WEB_BONDS` (one-sided bonds only for `a`). Cut-ins happen once per walk.

## Checklist for a new featured route
1. The route: ladder beats, flag, Ask, final, memories, endings, 5 drop-ins, `tells`, `invite`, `signoff`, `sore`, `reacts`, `epilogue`, `jealous`.
2. `moods` low + high with tells that hint without naming the answer ("He keeps checking the briefcase lock," not "He needs someone to believe in him"), plus `distrusts`.
3. `stale` (said the same thing three times) and `heard` (with `{name}`).
4. One `truth:true` reply in the drop-in where they most need grounding. It should sting but land.
5. Two `cases` replies that read differently by week.
6. About half the drop-ins put a `promise` on the warm answer (Era I: 43 of 87 reply sets).
7. 1–2 `sides` replies per bond.
8. Where a `breaks` reply stays, make it tempting: the true thing a tired booker says at 11 PM.
9. `backstage`: `won`, `lost`, `stole`, `flat`, `kept`, `broken`, `benched`, `idle`, `skip`, plus `cutIn` if they have a rival bond.
10. `TOWN_MAPS`: Sturgeon Bay `fixed` spot and a haunt in every tour town (re-run the placement check; the map is crowded).
11. Move their entry from `SUPPORTING_ROUTES` (roster.js) to `FEATURED_ROUTES`.

Aim for at least two defensible replies per scene, where the right one depends on the week. Keep it phone-sized: one sentence per `line`, one or two per reaction. Reactions use `“…”` for spoken parts.

## Checking your work
Run `node tests/game.test.cjs` and `node tests/webapp.test.cjs`.

Try a mood from the browser console: `relations().results={week:state.week-1,won:[],lost:[0]}`, then open Greek's evening.

Preview a walk after any show:
```js
state.recap.backstage={approaches:[{id:31,kind:'lost',other:0,on:true}],skipped:[{id:37,kind:'won'}],answers:{},done:false};openBackstageWalk()
```
Add `cutIn:true` to preview a cut-in. Easy mode shows reply chips ("What they need", promises, sides, morale).
