# Expansion portrait rerender handoff

IDs 34–37 retain their original identities and human-performer canon. This is an art-only update to the approved Cut-Paper Misfits visual language.

- Native generation outputs: four opaque 1254 × 1254 PNGs in this directory.
- Runtime exports: `art/liam-neesen-v2.jpg`, `art/the-tooth-v2.jpg`, `art/tessa-blanchard-v2.jpg`, `art/rulebook-dog-v2.jpg`; each 512 × 512, proportionally downsampled, without cropping or stretching.
- `generation.json` records prompts, identity references, approved atlas references, dimensions and source/export hashes.
- Original standalone portraits remain at their previous paths. All six approved original PNG atlases retain the kit manifest's SHA-256 hashes.
- `portraits.js` explicitly maps IDs 34–37 to square standalone images using the same centered 160 × 180 slice viewport as the approved atlas cells.
- Visual QA checked the original and new cast together at 160px and thumbnail size, then production-generated roster, casting spotlight and dialogue markup at a 390px phone viewport. Faces, hair/headgear and principal props remain readable.
- Saved QA previews are in the ignored `verification/` directory. Original style guide and reference manifest are in `docs/`.

No stats, roles, teams, title ownership, character dialogue or saved-game state were changed by this art rerender.
