# The Ledger: naughty, nice, and the Lord's era visits

*Shipped in 7.82–7.83 (`ledger.js`). Josh's decisions are at the end.*

Alongside His weekly file of sins (7.81, `snafu.js`), the Good Lord Above keeps a silent **Ledger** of your whole character. You never see a number. Once or twice an era He visits, reads it, and either gives a **gift** (good boy) or hands down a **punishment** (naughty). Weekly smites are the parking ticket; the Ledger is the report card. At the end He reads the whole career and picks one of three endings. Jesus hears things at prayer group and drops hints.

| | Weekly file | Ledger |
|---|---|---|
| Tracks | Sins only | Naughty **and** nice |
| Visible? | Yes, on the Decisions tab | No (easy mode shows a rough lean; Jesus hints) |
| Pays out | The next week, if heavy enough | At an era visit |
| Payout | A snafu you choose how to take | A gift or punishment, His choice |
| His favor | Moves with how you take a snafu | Sets how big the gift or punishment is |

## The booking rule
The drama of the show is the goal of booking, so **finishes never count** (cheating, run-ins, Face or Heel). Booking counts only when it reaches life outside the ring: promises, working someone three times in one night, promising more than the card holds, giving someone their spot back. Old cheat sins and ledger entries from 7.81–7.82 are forgiven on load.

## What counts
Weekly caps in brackets. Nothing that happens by default counts.

**Nice:** keep a promise +2 · "Thy will be done" to an act of God +3 · pay to make an act of God right +1 (+2 more if it was people: `c-motel`, `s-resale`, `s-legend`) · hard-truth reply +1 [2] · show up for an "Only this week" evening +2 · book someone back after 3+ weeks away +1 [2] · someone moves up an affection tier +1 [2] · protect the locker room from the celebrity +3 · generous tradition (kids' section, open tryouts, homecoming) +3 · win a territory night fair +1.

**Naughty:** break a promise −4 · blame a wrestler for an act of God −5 · something you said gets back −2 [4] · brush someone off (`reply.breaks`) −1 [2] · a bit at His expense that flops −1 · raid a rival's territory −3 · celebrity over the locker room −3 · work one wrestler 3+ times on a card −1 · promise more than the card holds −2.

## When He visits
1. **Check-in** halfway through an era (week 12 of a two-chapter era, week 6 of a one-chapter era), only if you lean clearly one way.
2. **Reckoning** on moving day, before the era epilogue reel. Always plays.
3. **After the dynasty**, a reckoning each season.
4. **Final judgment** when the legacy is claimed.

A visit plays before a same-week smite ("While I am here. Your file."). A stalled era still gets only two visits.

## How the game decides
- Score = net points in the window ÷ weeks, plus a quarter of the last era's average.
- Good boy at +0.75 or higher, naughty at −0.75 or lower, lukewarm between (just a look).
- His favor sets the size: Pleased or better gives two gifts; Displeased or worse, two punishments.

**Gifts:** collection plate returned (cash), forgiveness (wipes His file), blessed card (+1 quality per segment for a show), packed house (+15% for two shows), locker-room blessing (+5 morale, featured +3 trust), halo (+3 momentum), grace (waives the next act of God).

**Punishments:** empty chairs (−15% for two shows), cursed card (−1 quality per segment), tithe taken (cash), a locker room that's heard (−5 morale), an unprompted act of God, a blessing for the competition (rival +20% through the season review).

## Jesus' hints (7.83)
After a show Jesus can wave you over at the punch bowl with the current era's lean, never more specific: nice ("Somebody up there smiled"), naughty ("There was a long pause"), lukewarm ("He said 'hm.'"), or a visit coming. He speaks when the lean changes, after four weeks, or before a visit, never twice in two weeks. Code: `jesusHint` in `ledger.js`, stored on `recap.backstage.jesus`.

## Endings
The career's per-week average through the same bands: **Ringside, forever** (best), **Folding chairs, forever** (neutral), **The deepest pit of oblivion** (bad). The career continues; the ending can be rewatched from the Decisions tab.

## Ideas, not built
- His weekly greeting shifting with the Ledger, not only His mood.
- Smark Wahlberg sensing "a column with your name on it."

## Decisions (Josh)
1. Booking counts only when it impacts life outside the ring. No finish counts, Face or Heel.
2. The Pit never ends a career early.
3. Jesus drops hints.
4. Defaults: a two-faced booker nets out lukewarm; stalled eras hold at two visits; easy mode shows a rough lean.
