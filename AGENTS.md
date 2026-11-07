# Sturgeon Bay Slam: Rise to Supremacy

## Hard character rule

Every wrestler is a HUMAN PERSON performing a wrestling character. This applies to every existing and future roster entry, portrait, animation, costume, dialogue, narration, biography, signature match, prop, and save migration.

Animal, object, food, supernatural, or abstract names describe a person's gimmick or costume. Never depict or describe the performer as a literal animal, sentient object, food creature, or other nonhuman being. Keep human anatomy recognizable in portraits: a visible human face and human hands/arms, with costume details as appropriate. The Tooth is a person in tooth-themed gear; A Dog That The Rules Don't Say Is Banned is a person in a dog-themed costume. Characters are 100% committed to their gimmicks. Their dialogue must never explain that they are a person in a costume or otherwise break character. The Dog insists he IS a dog and argues the rulebook never says dogs cannot wrestle. This is in-character kayfabe; portraits and factual descriptions still establish human performers. Apply this distinction to all current and future wrestlers.

Preserve stable roster IDs and support importing previous roster sizes. Add a matching personality, voice, crowd response, signature match, signature prop, portrait, offline asset, and coverage for every new wrestler. Liam Neesen's visual gag stays exclusively in his portrait: do not acknowledge it in dialogue, biography, narration, mechanics, UI, or accessibility text. The one approved exception is Greek's insult in Jesus' welcome in `opening.js` (`openingWelcome`); don't add others.

## Checks

Run `node tests/game.test.cjs` and `node tests/webapp.test.cjs` after runtime changes. Bump all shell asset query versions together with `sw.js` for a release. Preserve existing careers and archived show results.

## Wrestler art

For artwork, read `docs/WRESTLER_ART_STYLE_GUIDE.md` and inspect the approved atlases before generating. Supply the actual approved images as style references and the current wrestler portrait as the identity reference. Match the Cut-Paper Misfits square bust composition, simplified adult caricature, paper construction and crop-safe layout. Do not change stats, roles, IDs, saves or the original approved atlas art for an art task. The guide's original ID table covers 0–33; expansion IDs 34–37 use explicit standalone portrait mappings in `portraits.js`.
