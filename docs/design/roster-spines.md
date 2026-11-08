# Roster spines and character decisions

Archive of the core-eight rewrite (7.74–7.78) and roster-spines (7.77) handoffs. Josh's verbatim spines live in the Claude Docs, which win over this file:
- Core Eight spines: https://claude.ai/artifact/HmDfHkNLbWH1X1vxhs9kFq
- Wider roster spines: https://claude.ai/artifact/SGCWDS5xcvkkRZXQMjDLKk
- Cast bible (older; spines override it): https://claude.ai/artifact/HKoJcDTaXEZjSh92RYbPtu

The goal is distinctiveness, not templates: each wrestler owns one strange, specific idea, surfaced at touchpoints the game already has. Test every line: could Greek or Ron say it? If yes, rewrite it.

## Locked decisions (Josh)
- Spines are authored per wrestler. Nothing shared across the roster.
- **Greek and Liam share an origin.** Liam kicked a director in the head after losing the lead in *Demeter's Baby*. Greek is that director and, after the kick, believes he is from Ancient Greece. Liam and Jesus can name the film and the kick. Greek remembers the kick but never identifies himself as a filmmaker (his research notebook hints at the old habit). Ask Josh before a line where Greek acknowledges the film.
- Greek's style is **"Greco Wrestling"**, never "Greco-Roman."
- **Ron** never takes a side, and his anger rises the longer a disagreement runs. His `sides` values reflect the booker's choices, not his own.
- **The Grinch** never reads dislike; rejection makes his love bombs bigger. Dislike reaches him only through a `truth` reply.
- **Charming** says the worst thought in the room with impeccable manners, and his lines avoid pronouns. His Ask ("every show gets more devious") is one appearance at the next tour show; any wider effect needs a design decision.
- **The Man of 2 Holds** never concedes a third hold exists. His irritation with the Dog comes from the Dog doing something that isn't one of the two.
- **Smark Wahlberg** is the one fourth-wall exception (see AGENTS.md).
- **Rudy from Football's** legs are pure text: no hidden penalty, and he never admits he's hurt.
- **Rudy Giuliani's** fury fires only when he's beaten by someone who cheated in that match (`cheated` flag; Interference counts).
- **Real-name wrestlers** are ring personas only.
- **Katy Perry's** `promo` promise counts double toward what a show owes.
- **Term Life Insurance Plan** is the Deductibles (17), so the Sweeps friendship already exists.
- Charming's full name is "Nasty Fucker"; the Grinch's is "Who Stole My Heart".

## Bonds (`WEB_BONDS`)
Greek/Liam grudge; Greek/Ron, 2 Holds/Dog and Sweeps/Grinch irritations; Charming → Ron one-sided; Sweeps/Deductibles friendship. From the wider roster: Mandy Mouse → the Dog (fear); John Smith ↔ Ron (irritation); Ted Turnsby → Charming (Charming never notices); Cleats → Rudy from Football (follower); Term Life → Rudy from Football (files claims on his legs); Freddie Flounder ↔ Human Houseboat (friendship); Smark ↔ the Miz (friendship); Smark ↔ Greek (irritation); Jesus → Greek (keeps trying to save him); Guetta ↔ Terrible Towel (irritation, `era:1`); One Man → 2 Holds (resents being outnumbered by a man with fewer holds than he has members); Grinch → Lemon Tart (crush, `era:1`).

## Supporting route flags (roster.js)
`neverSkips` (Rudy from Football), `noCutIn` (Carl), `moodOn:'heat'` (Towel, Guetta: rating below 50 is low, 80+ high), `holdsGrudge` (Towel), `leaks` (Jaxxon), `promiseWeight` (Katy `{promo:2}`). Show-night habits: `CALL_HABITS` in moments.js (John Smith takes the risky call; Pissboy stalls on promos aimed at anyone with heat on him).

## Known staging gaps on the road
Sweeps' stain and vigil assume a floor and chairs, Greek's loss flag a perch, and several Dog scenes a yard, gate or fence. Invitations avoid naming Sturgeon Bay on the road; a later pass could add local variants.
