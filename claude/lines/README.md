# Core Eight dialogue rewrite coverage

The inventories preserve the v7.73 text for comparison. Each field is marked **REWRITTEN**, **KEEP**, or **KEEP · locked**. Retained material includes scene titles and lines that already express the character’s spine, shared engine copy, and location labels. The files show the original wording. The live text is in `routes.js` and the other named source files.

| Release | Pair | Baseline inventories |
| --- | --- | --- |
| 7.74 | Greek and Liam | [Greek](greek-polanski-lines.md), [Liam](liam-neesen-lines.md) |
| 7.75 | Sweeps and the Grinch | [Sweeps](sweeps-mckenzie-lines.md), [the Grinch](the-grinch-lines.md) |
| 7.76 | 2 Holds and the Dog | [2 Holds](the-man-of-2-holds-lines.md), [the Dog](the-dog-lines.md) |
| 7.78 | Ron and Charming | [Ron](ron-toledo-lines.md), [Charming](charming-friendly-lines.md) |

The [supplemental inventory](additional-voice-inventory.md) covers `ringVoices`, `callLines`, and `CHARACTER_SPECIALS`. Character-specific show reports and backstage requests were checked against the new voices. Sweeps’ separate spotlight payoff in `stories.js` also uses his cleaning obsession. Jesus’s welcome and the current bond summaries use the new continuity. The six tutorial steps contain no character-specific dialogue. Haunt labels and coordinates were kept.

## Continuity and decisions

- Liam and Jesus can name *Demeter’s Baby* and describe the kick. Greek remembers the kick and treats it as incompatible with Greco Wrestling. His research notebook implies the old habit of recording material without having him identify himself as a filmmaker.
- Grinch’s existing Ask targets Lemon Tart as a wrestling partner. The tag is platonic and the romance stays dormant until Era II.
- Ron’s existing `sides` values still represent the booker’s choices and what gets repeated. Ron’s spoken replies never endorse either person or promotion. The hearing asks him to declare an abstention.
- Charming offers increasingly devious shows. The actual Ask remains a single appearance at the next tour show. Any wider booking effect requires a design decision.
- The remaining tour-specific staging gaps are the assumed floor and chairs in Sweeps’ stain and vigil, the perch in Greek’s loss flag, and the yard, gate and fence in several Dog scenes. Invitations avoid naming Sturgeon Bay on the road. A later location pass could give those scenes portable staging or local variants.

## Wider roster bonds

The wider roster shipped in v7.77 while the last pair was in progress. Greek and Ron now have alternate opening lines for those encounters. They use the same existing replies and effects.

| Bond | How the bond reads now |
| --- | --- |
| Greek and Smark | Greek’s `cutIn` and `benched` lines challenge Smark’s claim to tradition through Greco Wrestling. |
| Jesus and Greek | After losing to Jesus, Greek would rather correct a grip than be saved. The bond is one-sided from Jesus. |
| John Smith and Ron | Ron cuts off corrections to corrections. When benched he objects to the length of the debate over John’s announcement. |
| Ted and Charming | Ted supplies the comparison. Charming fails to notice the rivalry. |
| One Man and 2 Holds | One Man supplies the resentment. 2 Holds stays focused on mastering his two holds. |
| Mandy and the Dog | Mandy supplies the flinch in her `benched` line. The Dog stays focused on getting a match. |

The November 8 Markdown handoff pack provided the spines and field references. The live Claude artifact could not be consulted. Each release passed the game and webapp suites. The final audit also compared route shapes, stable IDs, promise fields, style values, and side effects with the baseline.
