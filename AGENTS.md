# Sturgeon Bay Slam: Rise to Supremacy

## Hard character rule

Every wrestler is a HUMAN PERSON performing a wrestling character. This applies to every existing and future roster entry, portrait, animation, costume, dialogue, narration, biography, signature match, prop, and save migration.

Animal, object, food, supernatural, or abstract names describe a person's gimmick or costume. Never depict or describe the performer as a literal animal, sentient object, food creature, or other nonhuman being. Keep human anatomy recognizable in portraits: a visible human face and human hands/arms, with costume details as appropriate. The Tooth is a person in tooth-themed gear; A Dog That The Rules Don't Say Is Banned is a person in a dog-themed costume. Characters are 100% committed to their gimmicks. Their dialogue must never explain that they are a person in a costume or otherwise break character. The Dog insists he IS a dog and argues the rulebook never says dogs cannot wrestle. This is in-character kayfabe; portraits and factual descriptions still establish human performers. Apply this distinction to all current and future wrestlers.

Preserve stable roster IDs and support importing previous roster sizes. Add a matching personality, voice, crowd response, signature match, signature prop, portrait, offline asset, and coverage for every new wrestler. Liam Neesen's visual gag stays exclusively in his portrait: do not acknowledge it in dialogue, biography, narration, mechanics, UI, or accessibility text. The one approved exception is Greek's insult in Jesus' welcome in `opening.js` (`openingWelcome`); don't add others.

Smark Wahlberg (roster 26) is the one approved exception to the fourth wall. In `roster.js` he senses the booking sheet, the A–D grades and the promises as if from the other side of a window. He never names the real world outright, no other wrestler reacts to it, and nobody else gets it. The kayfabe scan still covers his lines, so write around `costume|performer|real name|not really a|gimmick`.

Real-name entries (Rudy Giuliani, Katy Perry, David Guetta, Mike "The Miz" Mizanin, Cuba Gooding III, Chad Kroeger) are ring personas only. Every line is about the persona on the card, never the actual person.

Dialogue for the featured eight lives in `routes.js`; everyone else with a spine lives in `roster.js` (`SUPPORTING_ROUTES`, format comment at the top).

## Checks

Run `node tests/game.test.cjs` and `node tests/webapp.test.cjs` after runtime changes. Preserve existing careers and archived show results.

To release, run `./release.sh <version>` (e.g. `./release.sh 7.84`). It bumps every `?v=` in `index.html` and `sw.js` plus `sw.js` `VERSION` in one go; don't edit them by hand. Then add a CHANGELOG entry at the top, run both suites and push to `main`. New script or CSS files also go in `index.html`, the `sw.js` asset lists and the file list in `tests/game.test.cjs`.

## Working cheaply

- Grep `routes.js`, `roster.js`, `relationships.js`, `game.js` and `moments.js` rather than reading them whole. Some lines in `game.js`, `booking.js` and `moments.js` run to thousands of characters, so prefer `grep -o` with a short window or `cut -c1-300` over printing full matching lines.
- Read only the top of `CHANGELOG.md` (newest first).
- `docs/design/` holds finished design references (route writing guide, ledger, roster spines). Open one only when the task touches it.
- The art style guide's approved atlases are `art/paper-0*.jpg`, the same files the game loads.

## Wrestler art

For artwork, read `docs/WRESTLER_ART_STYLE_GUIDE.md` and inspect the approved atlases before generating. Supply the actual approved images as style references and the current wrestler portrait as the identity reference. Match the Cut-Paper Misfits square bust composition, simplified adult caricature, paper construction and crop-safe layout. Do not change stats, roles, IDs, saves or the original approved atlas art for an art task. The guide's original ID table covers 0–33; expansion IDs 34–37 use explicit standalone portrait mappings in `portraits.js`.
