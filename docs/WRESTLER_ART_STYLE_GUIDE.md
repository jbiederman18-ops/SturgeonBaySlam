# Sturgeon Bay Slam: wrestler art direction

Agent instructions for extending the approved **Cut-Paper Misfits** roster of **Wisconsin Wrestling Alliance (WWA)**. This guide covers character artwork, not a redesign of the cards or dialogue interface.

## 1. Start with the actual images

**The existing atlases are the visual source of truth. Always inspect them before generating.** A text prompt alone is not a sufficient style reference. Use the approved images as visual conditioning when the image tool supports it. Match their construction and proportions without copying a different wrestler's identity.

Paths in this copy assume the Sites checkout. In the portable/GitHub layout, replace `dist/art/` with `art/`. In the standalone agent kit, the references are also at `art/`.

| Reference | Best use |
| --- | --- |
| [paper-00.jpg](../art/paper-00.jpg) | Foundational faces, physical wrestlers, cloth, and the human Terrible Towel. |
| [paper-01.jpg](../art/paper-01.jpg) | Hair, a lab coat, masks, mouse-ear headgear, and Sweeps's working clothes. |
| [paper-02.jpg](../art/paper-02.jpg) | Jackets, a space costume, a ruler, a hat, and the human insurance salesman. |
| [paper-03.jpg](../art/paper-03.jpg) | Varied expressions; phones, guitars, holiday gear, fish-themed gear, and citrus tailoring. |
| [paper-04.jpg](../art/paper-04.jpg) | Halos, DJ equipment, tourist accessories, formalwear, and the human nautical heavyweight. |
| [paper-05.jpg](../art/paper-05.jpg) | A woman in snack-themed gear, an older man in a suit, a footballer, and a larger custard-themed wrestler. Only four cells are assigned. |

Recommended reference pair for a new wrestler: **paper-00** for the general art language, plus the sheet with the closest clothing, hair, body type, or prop. For a returning wrestler, their own current portrait is the primary identity reference. All six sheets are equally approved; the first sheet is a convenient starting point, not a requirement to copy its demographic mix.

## 2. The style in one paragraph

An expressive, adult **human wrestling caricature assembled from textured coloured paper**. Big readable features, thick angular brows, simplified eyes, a warm geometric nose, chunky hands, and an exaggerated upper-body silhouette. Skin, hair, clothes, and props all share the same tactile paper construction: overlapping shapes, irregular scissor-cut edges, occasional torn fibres, subtle creases, and slight changes of colour between facets. Broad flat colour does the work; restrained seam shadows suggest paper layers. The character stands alone against warm, lightly fibred cream paper. It should feel handmade, theatrical, scrappy, and full of conviction.

## 3. Non-negotiable rules

- **Every wrestler is human.** A name or gimmick is expressed through costume, a prop, a gesture, or attitude. Terrible Towel is a human in terrycloth gear; Term Life Insurance Plan is a human insurance salesman; Freddie Flounder is a human in fish-themed gear; Cleats is a human carrying boots; Terry Pudding is a human in custard-coloured gear. No sentient objects, animal anatomy, food bodies, or literal houseboats.
- Preserve an existing wrestler's visible identity: skin tone, face, body type, hair, facial hair, costume, signature accessory, and personality. Change these only when the user's request calls for it. A character's name is not permission to replace the approved design with a celebrity photograph or a different familiar character design.
- Keep the **paper material across the whole image**. Do not combine a realistic face with a flat paper costume.
- Use the current cream background. The approved atlas files are opaque RGB PNGs, not transparent cutouts. Only switch to transparency when specifically requested.
- Portrait art contains **no card frame, nameplate, rating, dialogue, caption, watermark, or promotional logo**. Existing simple costume numbers and emblems are permitted. The application supplies UI and the current champion's WWA belt.
- Preserve the approved drawings. Do not regenerate existing sheets just to add a wrestler or tidy the art.

## 4. How to construct the drawing

| Element | Match the approved treatment | Reject |
| --- | --- | --- |
| Silhouette | Stocky or otherwise distinctive adult build; strong shoulders and a generous head; a clear waist-up silhouette. Allow slim, round, tall, short, elegant, and heavy characters. | One identical muscular body for everybody; realistic anatomy studies; tiny-headed figures; infant-like chibi proportions. |
| Face | Angular or gently blocky planes, broad dark brows, simple off-white eyes with dark pupils, a triangular or polygonal warm nose, a few decisive mouth shapes. Small asymmetries carry personality. | Glassy eyes, airbrushed lips, skin pores, beauty retouching, complicated facial rendering. |
| Expression | A specific thought: smug certainty, cheerful menace, wounded pride, bureaucratic concern, overeager enthusiasm. Match the character. | A roster of identical snarls, identical smiles, or blank heroic faces. |
| Hair and beard | Overlapping angular tufts and cut-paper masses; a few larger light/dark facets. | Individually rendered strands, soft digital hair brushes, glossy shampoo highlights. |
| Hands | Human, readable simplified shapes; broad knuckles, clear thumb direction, and intentional gripping or gesturing. Check the anatomy even when stylized. | Fused fingers, extra digits, dislocated wrists, props floating through palms. |
| Clothing | Simple recognisable gear or character costume; irregular paper hems, broad folds, distinct lapels, straps, cuffs, and fabric panels. | Glossy latex rendering, microscopic stitching, complicated armour, unnecessary costume clutter. |
| Material | Visible paper grain, light fibres and creases, slightly imperfect cuts; texture integrated into each material. | A flat vector image with one noisy filter placed over it, excessive distress, wax, plastic, felt dolls, clay, or glossy 3D. |
| Depth | Flat layered planes; sparse darker paper facets and restrained shadows at overlaps. | Cinematic lighting, rim lights, bloom, bokeh, deep cast shadows, dramatic perspective, or photorealistic volume. |
| Edges | Mostly angular scissor-cut geometry, with occasional torn or fibrous edges. Shapes and seams define the drawing. | A thick black outline around every object, perfect vector curves, or an indistinct painterly silhouette. |
| Props | One dominant, instantly recognisable gimmick prop, occasionally one supporting detail. Render it with the same paper vocabulary. | Several competing jokes, unreadable miniature objects, elaborate backgrounds, or props that hide the face. |

### Colour

Use saturated but slightly weathered paper colours: mustard and gold, red and coral, navy and denim blue, forest green and teal, plum and purple, cream, charcoal, and warm natural skin colours. A useful starting point is two main outfit colours plus one accent. This is a design heuristic, not a fixed colour count.

Keep skin, hair, clothing, and background distinguishable at thumbnail size. Texture must not erase that separation. Do not wash the whole portrait into brown or beige. Match the actual reference pixels rather than treating these colour names as exact swatches.

`#f2e9d5` is the renderer's cream underlay; it is not a claim that every background pixel has that value. The roster's `color` field is a UI accent, **not** an instruction to repaint the wrestler's established costume. For example, The Man of 2 Holds wears red and yellow in the approved image even though his roster UI accent is muted green.

### Pose and humour

Use an idle, waist-up character portrait, not a complex match scene. A compact three-quarter turn, hands on hips, folded arms, a raised finger, a smug thumbs-up, or a prop held at chest level gives the dialogue screen a usable actor. The eyes and face should remain clear.

The joke comes from the human's belief in the gimmick. Terry is delighted by a tiny spoon; the insurance salesman is proud of a policy; Sweeps believes the broom deserves the main event. Show that conviction without turning the portrait into a meme panel. Avoid making every human a macho sneer: the current roster includes warmth, vanity, uncertainty, camp, and delight.

## 5. Composition and delivery contract

### Current production format: six portraits per atlas

- Each approved sheet is an **opaque PNG, 1536 × 1024 pixels**.
- It is a **3-column × 2-row** atlas with **512 × 512-pixel logical cells**.
- Cell order is left-to-right on the top row, then left-to-right on the bottom row.
- The background continues across the sheet. No visible grid, panel dividers, labels, drop-shadow cards, or gaps added between cells.
- Each cell contains one separate human bust. No shared pose, interaction, or prop crossing into another assigned cell.
- Keep scale, paper texture, background and character placement consistent with the neighbouring approved cells.
- The last sheet has IDs 30–33 only; its last two cells are unassigned. Empty cells are not additional characters.

The renderer in `portraits.js` selects the sheet with `floor(id / 6)` and the cell with `id % 6`. Each cell starts at:

```text
x = (cell % 3) * 512
y = floor(cell / 3) * 512
```

The current guard accepts **IDs 0–33** and falls back to One Man for IDs outside that range. Adding a file or filling an unused cell does not automatically register a new wrestler. Update the mapping deliberately when integrating new roster entries, and preserve all existing IDs and saved-game associations.

### Crop-safe layout

The app displays a square cell inside a **160 × 180 portrait viewport** using a centred `slice` crop. That removes approximately **5.6% from each side** of the square. It does not justify cutting off a hairstyle, face, or essential prop.

For new work, use these practical safe areas:

- Keep the face and identifying features inside the central **80% of cell width**—roughly x = 51–461 in a 512-pixel cell.
- Leave room above hair, hats, halos, ears-as-headgear, and raised fingers. Use the approved portrait scale as the visual judge.
- Cropping the torso at the bottom is intentional. A missing forehead, hat, hand holding the identifying prop, or essential prop is not.
- Keep essential details clear of the lowest **13%** where the application's champion belt can appear. Do not bake the belt into a portrait.
- Check the rendered card as well as the source sheet. A technically correct square image can still be clipped in the game.

These safe areas are guidance for new portraits, not measured claims that every legacy portrait perfectly follows them.

### A single new portrait

A square individual image is useful for developing or approving a character. Ask for the same square-cell bust composition and cream background. Keep the native output and confirm its dimensions; do not claim the tool returned 512 × 512 unless it actually did. A standalone image needs an explicit renderer mapping or an approved integration into an atlas. Do not silently stretch it, change the existing mapping, or replace a whole approved sheet to make it fit.

## 6. Agent workflow

1. Read this guide and the target wrestler's `game.js` entry. If this is an existing wrestler, find the current cell in the identity table below.
2. Open the relevant approved sheet images with an image-viewing tool. Inspect the target cell and a second reference for material/style. Do not generate from filenames or descriptions alone.
3. Write a short character brief using the form below. For a new character, describe a human performer and their visual hook explicitly. For an edit, list the exact change and the identity details to preserve.
4. Use the available image-generation/editing tool, supplying the actual references. With tools that accept local reference paths, use those paths; do not pretend a filename written in the prompt attaches an image. In the current `image_gen` interface, `referenced_image_paths` supplies local references; inspect them first. Do not also pass the recent-conversation-image mechanism.
5. Generate only the requested art. For a new character, references are a guide to material and design language, not an instruction to copy another wrestler's face. For an edit, keep all unrequested characters/cells intact and verify them afterwards. If a full-sheet edit changes neighbours, reject it rather than quietly accepting roster drift.
6. Compare the output beside the approved images, using the acceptance checklist. Revise the prompt to address the specific mismatch. More detail and sharper rendering are not automatically improvements.
7. Inspect the actual file dimensions, format, cell placement, and crop. When integrating, check the roster card, casting spotlight, and speech scene at phone size. Body details may simplify; identity must survive.
8. Keep the source image, the prompt, the reference filenames, and the intended ID/cell mapping together in the handoff. Do not alter wrestler stats, roles, teams, title ownership, or saved progress for an art-only task.

### Character brief

```text
Character name / stable ID:
Existing or new:
Human appearance (age range, build, skin tone, face, hair, facial hair):
Clothing (large shapes and 2–3 main colours):
Primary gimmick prop or wearable detail:
Expression / attitude:
Compact gesture or pose:
Required identity details to preserve:
Approved reference sheet(s) and cell(s):
Requested output (single square portrait / named atlas cells):
Changes explicitly requested, if any:
```

## 7. Reusable generation prompts

Replace every bracketed field. Supply the referenced images through the tool as well as naming them in the text. Do not paste a whole six-character atlas brief when only one portrait is requested.

### New human wrestler — single portrait

```text
Create ONE new human wrestler portrait for Sturgeon Bay Slam, the Wisconsin
Wrestling Alliance game. Use the supplied approved Cut-Paper Misfits images
as the visual reference for paper material, facial construction, proportions,
texture, colour treatment and plain background. Create a new identity rather
than copying a reference wrestler's face.

CHARACTER: [name]. An adult human [appearance and build].
WEARING: [large costume shapes, main colours, one identifying wearable].
GIMMICK PROP: [one clearly readable prop, or none].
EXPRESSION: [specific emotion / comic conviction].
POSE: [compact gesture], waist-up, looking toward the viewer or slightly to
one side. Keep the complete head and distinguishing prop comfortably in frame.

Build the whole figure from irregular overlapping pieces of textured coloured
paper: angular scissor-cut hair, broad dark eyebrows, simple off-white eyes,
a geometric warm nose, chunky expressive hands, and large clothing panels.
Visible paper fibres, light creases and restrained seam shadows. Broad flat
colour with a few darker paper facets. Match the references' handmade,
theatrical adult caricature and strong small-screen silhouette.

Square portrait-cell composition. Plain warm fibred cream-paper background.
Keep the face and essential prop within the central 80% of the square so a
centred narrow portrait crop remains readable. Leave the bottom band as
simple torso for the game's separate championship overlay.

The character is human: [spell out the human interpretation if the name
suggests an object, animal, food or supernatural creature]. No card layout,
name, caption, rating, watermark, belt, or background scene. A simple costume
number or emblem is allowed only when included in this brief.

Avoid photorealism, glossy 3D, plastic skin, cinematic lighting, smooth gradient
shading, generic superhero anatomy, anime styling, chibi proportions, perfect
vector curves, thick outlines around every shape, and a surface-only noise
filter. Keep the same paper construction as the approved images.
```

### Existing wrestler — controlled edit

```text
Use [target sheet, row, column, ID and name] as the identity reference, and
[second approved sheet] as the material/style reference. Make this change only:
[exact requested change].

Preserve this human's skin tone, face shape, hair, build, established outfit,
expression/attitude, and signature prop except where the requested change
explicitly replaces a detail. Keep the same Cut-Paper Misfits construction,
cream background, waist-up scale and crop-safe placement. Preserve every
unrequested portrait if the output is a shared sheet. Do not add UI, names,
ratings, a championship belt or a new background.
```

### New six-character production sheet

```text
Create an opaque 1536 × 1024 PNG character atlas in the exact visual language
of the supplied approved Cut-Paper Misfits references. Arrange six separate
human waist-up portraits in an invisible 3-column by 2-row grid, one person
per equal 512 × 512 logical cell. No visible cell borders or text labels.
Use one consistent warm cream-paper background, character scale and paper
texture. Keep each person's face and identifying prop in the central 80% of
their own cell. No person or prop may cross into a neighbouring cell.

Top left: [human character brief and intended ID].
Top middle: [human character brief and intended ID].
Top right: [human character brief and intended ID].
Bottom left: [human character brief and intended ID].
Bottom middle: [human character brief and intended ID, or explicitly blank].
Bottom right: [human character brief and intended ID, or explicitly blank].

[Append the material, style and exclusions from the single-portrait template.]
```

### Example human interpretation: Terrible Towel

```text
An adult human heavyweight with dark skin, a short squared haircut, a small
moustache, thick angry brows and a stubborn scowl. Mustard-yellow terrycloth
ring gear with cream horizontal stripes, a yellow towel draped over human
shoulders, white wrist wraps, fists raised near the chest. Match ID 4 in
paper-00, bottom middle. He is a human wrestler who uses a towel gimmick;
he is not a towel with eyes, a textile creature, or a mascot body.
```

For a new pose, use that brief together with the existing portrait and the controlled-edit template; do not use it to replace the approved ID 4 drawing without a request.

## 8. Approval checklist

Approve only after inspecting the image, not just its prompt or filename.

- [ ] Clearly human; the gimmick reads through clothing, props and attitude.
- [ ] Same layered paper construction as the approved atlas, including skin and hair.
- [ ] Broad flat colours, angular shapes, readable brows/eyes/nose, and tactile texture.
- [ ] A specific expression; no accidental change of an existing wrestler's identity.
- [ ] Silhouette, face and main gimmick still read at about **96–160 pixels wide**.
- [ ] Human hands and prop contact make sense; no extra or fused limbs.
- [ ] Whole hairstyle/headwear and defining prop survive the 160 × 180 display crop.
- [ ] Same warm cream background; correct opacity and actual output dimensions checked.
- [ ] No baked card UI, text labels, ratings, or championship belt.
- [ ] Correct sheet/cell order; no overlap or drift in neighbouring portraits.
- [ ] Existing IDs and saved-game associations preserved during integration.

If the material looks right but the face is wrong, it fails identity. If the face is right but the rendering is glossy or realistic, it fails style. Fix the specific issue rather than regenerating the whole approved roster.

## 9. Current identity and cell index

Rows and columns below are **1-based**. IDs remain **0-based**. This table describes the approved artwork, not new costume requests. Retain the visible identity in the actual reference if a short description cannot capture it.

| ID | Wrestler | Sheet / row / column | Visible identity anchors |
| --- | --- | --- | --- |
| 0 | Greek Polanski | paper-00.jpg / 1 / 1 | Laurel wreath, dark angular hair and beard, cream toga, gold fastening; dramatic clenched fist. |
| 1 | The Man of 2 Holds | paper-00.jpg / 1 / 2 | Red-and-yellow wrestling mask with a large 2, red singlet, two raised fingers; furious certainty. |
| 2 | Rudy, from Football | paper-00.jpg / 1 / 3 | Green-and-cream football jersey numbered 21, brown hair, eye-black, a gold helmet held at chest height. |
| 3 | One Man | paper-00.jpg / 2 / 1 | Bald broad bruiser, dark blue singlet numbered 1, blue wristbands, stern face and two fists. |
| 4 | Terrible Towel | paper-00.jpg / 2 / 2 | Human heavyweight with short dark hair and moustache; yellow striped gear, yellow towel, white wrist wraps. |
| 5 | Rudy Giuliani | paper-00.jpg / 2 / 3 | Older balding human with glasses, navy suit, red tie and brown briefcase; raised lecturing finger. |
| 6 | Pissboy, P.H.D | paper-01.jpg / 1 / 1 | Spiky white hair and moustache, yellow goggles, white lab coat, yellow gear and green flask. |
| 7 | Mike “The Miz” Mizanin | paper-01.jpg / 1 / 2 | Spiked brown hair, black angular sunglasses, black-and-gold sleeveless showman gear. |
| 8 | Frost “Cold” Freeze | paper-01.jpg / 1 / 3 | Silver angular hair and beard, blue-and-white jagged cold-weather robe; human face and raised fists. |
| 9 | Mandy Mouse | paper-01.jpg / 2 / 1 | Dark bob, round mouse-ear headband, pink-and-black heart singlet, painted whiskers; playful peace sign. |
| 10 | Sweeps McKenzie | paper-01.jpg / 2 / 2 | Dark hair and large moustache, green cap, cream shirt, blue overalls, upright broom and thumbs-up. |
| 11 | Turtle, From Entourage | paper-01.jpg / 2 / 3 | Green backwards cap and shirt, gold chain, stubble, folded arms and an easygoing smirk. |
| 12 | “Street Smart” John Smith | paper-02.jpg / 1 / 1 | Tousled brown hair, charcoal hoodie, simple red-and-white badge; hand thoughtfully under chin. |
| 13 | Katy “Space Taking” Perry | paper-02.jpg / 1 / 2 | Blue bob, silver circular space headwear, blue-and-silver outfit, gold star and white gloves. |
| 14 | Cuba Gooding III | paper-02.jpg / 1 / 3 | Dark curly hair and goatee, purple-and-gold open robe with III; theatrical grin and a three-finger gesture. |
| 15 | Carl “Parallel” Parker | paper-02.jpg / 2 / 1 | Dark parted hair and moustache, blue striped singlet, yellow ruler and white wrist tape. |
| 16 | Maddox Hatter | paper-02.jpg / 2 / 2 | Ginger hair, purple tall hat, green jacket, yellow bow tie, patterned waistcoat, teacup and pocket watch. |
| 17 | Term Life Insurance Plan | paper-02.jpg / 2 / 3 | Human salesman with dark hair and square glasses, green suit, gold tie, policy paper and brown briefcase. |
| 18 | “Nasty Fucker” Charming Friendly | paper-03.jpg / 1 / 1 | Large swept brown hair, rose-pink dinner jacket, cream shirt, black bow tie and studded wrist cuff. |
| 19 | Jaxxon “Twitter Fingers” Xander | paper-03.jpg / 1 / 2 | Spiky dark hair, small goatee and earring, purple hoodie with mint drawstrings, phone and raised finger. |
| 20 | The Grinch Who Stole My Heart | paper-03.jpg / 1 / 3 | Human holiday wrestler with green hair, Santa hat, green-and-red fringed gear, heart motif and hand hearts. |
| 21 | Chad Kroeger | paper-03.jpg / 2 / 1 | Long angular blond hair and small beard, black sleeveless vest, pendant, acoustic guitar and open singing mouth. |
| 22 | Freddie Flounder | paper-03.jpg / 2 / 2 | Human with teal cap and scale-patterned singlet, fin-shaped costume shoulders, tape and a pleased expression. |
| 23 | Lemon Tart | paper-03.jpg / 2 / 3 | Side-swept blond hair, leaf accessory, yellow-and-cream striped jacket and citrus brooch; sly smile. |
| 24 | “Party Animal” Jesus H. Christ | paper-04.jpg / 1 / 1 | Long brown hair and beard, halo headband, yellow sunglasses, cream-and-red robe, red cup and party gesture. |
| 25 | “Funky Tunes and Attitude” David Guetta | paper-04.jpg / 1 / 2 | Swept grey hair and beard, headphones, dark glasses, black-and-purple jacket and a compact DJ controller. |
| 26 | Smark Wahlberg | paper-04.jpg / 1 / 3 | Blue backwards cap and shirt, clipboard with large rating stars, pen held thoughtfully at the mouth. |
| 27 | The Local Tourist | paper-04.jpg / 2 / 1 | Cream-and-green brimmed hat, sunglasses, moustache, orange floral shirt, camera and folded map. |
| 28 | “Fetching” Ted Turnsby | paper-04.jpg / 2 / 2 | Tall swept auburn hair, green suit, mustard bow tie, blue-and-cream rosette and a tennis ball. |
| 29 | The Human Houseboat | paper-04.jpg / 2 / 3 | Human heavyweight with dark hair and grey beard, captain hat, navy porthole singlet, stripes and anchor prop. |
| 30 | Holly “Pizza Pocket” Posey | paper-05.jpg / 1 / 1 | Orange ponytail, freckles, coral hoodie with a pizza slice in the pocket, wrist wraps and an exuberant gesture. |
| 31 | “Politically Neutral” Ron Toledo | paper-05.jpg / 1 / 2 | Older grey-haired human with moustache, grey suit and striped tie, equals-sign badge and restrained thumbs-up. |
| 32 | Cleats | paper-05.jpg / 1 / 3 | Human footballer with short dark hair and goatee, green-and-cream jersey numbered 23, black wristbands and cleats over a shoulder. |
| 33 | Terry Pudding | paper-05.jpg / 2 / 1 | Round curly-haired human in mustard-and-custard singlet with brown scalloped trim; silver spoon and delighted grin. |

The approved images are included in the companion agent kit. [reference-manifest.json](art-reference-manifest.json) records their dimensions, SHA-256 hashes, and the stable character-to-cell mapping so another agent can verify the references before working.
