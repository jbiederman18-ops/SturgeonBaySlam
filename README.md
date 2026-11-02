# Sturgeon Bay Slam

Run Wisconsin Wrestling Alliance in a mobile-first wrestling booking game about convincing a very small, very loud room to love a very strange roster.

## Play locally

The game uses plain HTML, CSS and JavaScript. There are no dependencies or build steps.

From the GitHub repository root, run:

```sh
python3 -m http.server 5173
```

Open http://localhost:5173. Any static web host can serve the same files. For GitHub Pages, choose **Deploy from a branch**, then **main / (root)** in the repository's Pages settings.

In the Sites source checkout, serve the app directory instead:

```sh
python3 -m http.server 5173 --directory dist
```

## Start a career

Choose **Start your promotion** on the intro screen. New careers begin with four empty show slots, $4,250, and a roster of 34 human misfits. No matches, winners, finishes or promo ideas are selected for you.

- Book each slot as a match or promo. Choose every wrestler, ruleset and finish; write each promo's opening idea.
- Book singles, tag teams, triple threats, four-ways, six-person tags and battle royals. Rules include ladders, tables, cages, submissions and more.
- Run the show and choose the turning point in each segment. Wrestlers answer each other in character; decisions adjust segment quality by up to three points.
- Read the recap and the optional Booker's report, develop rivalries and teams, and balance appearance fees against ticket revenue.
- Every fourth week is a big event. The career continues across seasons, with a fresh empty card every week.

The roster's starting stats, personalities and championship establish the world; booking decisions belong to the player.

## Save and continue

Existing careers and Brawl in Boseman backup files remain compatible.

Progress saves automatically in this browser on this device. **Continue career** resumes a show, a recap or the booking desk. Returning to the title screen does not reset progress.

Use **Office → Export career** to download a JSON backup. **Import career** restores that backup after confirmation, including in another browser or on another hosting domain. Starting a new career replaces the local career only after confirmation. Browser storage is local, not a cloud account: export before clearing it.

## Project files

- `index.html`: app entry point and stylesheet/script order.
- `game.js`: roster, promotion state, booking screens and weekly career.
- `career.js`, `career.css`: intro screen, explicit blank booking validation and portable saves.
- `booking.js`, `booking.css`: interactive wrestler-card casting desk.
- `matches.js`: match formats, rules, financial simulation and ratings.
- `moments.js`: character ring styles and decision scoring.
- `kayfabe.js`: responsive dialogue scenes and actual match finishes.
- `exchange.js`, `exchange.css`: speech exchange presentation and accessible playback.
- `portraits.js`, `art/`: existing cut-paper human character artwork.

All content runs in the browser. No API keys, GitHub tokens, analytics, accounts or backend services are required to play. The game does not contact GitHub at runtime.

## Verification

The release was browser-tested at 320, 390, 768 and 1440 pixels, including a complete show, new-week empty cards, explicit winner/rules/finish selection, cancellation, save/resume, reordering, and backup export/import. Dialogue was also checked across all 34 wrestlers and supported match formats.
