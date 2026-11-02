# iOS webapp implementation and verification

## Installation and saves

The manifest uses relative `id`, `scope` and `start_url`, so the game works at a domain root or in a GitHub Pages project subdirectory. It requests standalone display without locking orientation. iPhone/iPad PNG touch icons and a browser favicon are declared explicitly. The icon is opaque and has no baked-in rounded corners.

The title and Office explain Safari's Share → Add to Home Screen flow. Open the new app while online and wait for its own offline-ready status before disconnecting. Safari and a Home Screen app may have separate storage, so an existing career should be exported and imported into the installed app. Export uses file sharing when supported, with a download fallback. Canceling the share sheet does not trigger an unwanted download. Imports use an attached file input compatible with Safari's Files picker.

Career state remains in the existing localStorage key; existing saves migrate normally. Identical renders do not rewrite the save. The app saves on background/pagehide events and stops its typewriter timer. A failed save produces a persistent warning and prevents an update restart. A user gesture requests persistent storage when supported, but browser/device eviction remains possible; exported backups are the portable recovery mechanism.

## Offline shell and updates

`sw.js` precaches a complete versioned shell: HTML, manifest, scripts, styles, three fonts, icons and six optimized portrait atlases. The measured download is about 4.44 MB. The JPEG portrait sheets preserve the original 1536×1024 layout and reduce the six-sheet transfer from 14,996,737 to 3,165,622 bytes. Original PNGs and the large design exports are excluded from the offline cache.

Installation must finish before activation. An incomplete install does not replace a working release. Fetches serve a consistent cached shell, including canonical root and index navigations with query strings. Non-game navigations, non-GET requests and other origins are untouched. Cache names include the deployment scope; activation only removes older caches belonging to this game and scope, never other applications' caches or career data.

A new worker waits. The update action is hidden during a live show or open dialog. The player explicitly chooses Save & restart. Save failure blocks that action; controller change reloads only the window that requested the update. A new release can also activate after all old windows close. For each runtime release, bump `VERSION` and every asset query in `sw.js` and `index.html` together.

## Touch and layout

- `viewport-fit=cover` with safe-area top/bottom/left/right spacing for the status bar, Home indicator, navigation, title, toasts and dialogs.
- Dynamic viewport height and Visual Viewport resize handling for keyboard-aware dialog limits.
- 16px form controls without disabling pinch zoom; touch controls remain at least 44px high.
- Scroll containment for dialogs, vertical scrolling on portrait swipe surfaces, and no fixed-body scroll reset.
- A bottom navigation layout in short landscape viewports, plus standalone live-show spacing.
- Light form rendering, reduced-motion support, native focus indicators and readable status messages.

## Verification performed

- Both dependency-free suites pass: `node tests/game.test.cjs` and `node tests/webapp.test.cjs`.
- Automated tests check icon dimensions and opacity, manifest scope, complete shell coverage, 38 cached resources, offline root/index navigation, scoped cache cleanup, update waiting, failed installation and missing-cache detection.
- Browser: stopped the local web server and successfully reloaded the app, resumed the career and opened casting with portraits intact.
- Browser: installed a newer worker while an editor was open; the restart action stayed hidden, appeared after closing the editor, then preserved week, cash and draft through a player-requested restart.
- Responsive browser checks at 320×740, 390×844, 430×932, 852×393 and 1024×768: no horizontal document overflow; dialog/footer remained within the visible viewport. Earlier story-game checks also covered desktop widths.

These are desktop browser responsive/service-worker checks, not a physical iPhone or iPad Safari run. A final device smoke test should install from the hosted HTTPS URL, check the status bar/Home indicator in both orientations, enter a promo using the keyboard, export/import via Files, background/resume a show, and relaunch in airplane mode after the installed app reports ready.

## Primary platform references

- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) — touch icons and Home Screen metadata.
- [WebKit: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) — viewport-fit and safe-area environment variables.
- [Apple: What's new in web apps](https://developer.apple.com/videos/play/wwdc2023/10120/) — standalone web apps and separate app storage.
- [WebKit: Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) — storage persistence, quotas and eviction.
