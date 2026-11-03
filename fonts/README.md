# Offline typefaces

The active 7.12 faces are Barlow Condensed Bold (700), ExtraBold (800), ExtraBold Italic (800 italic), and variable DM Sans (100–1000). CSS family names now match the actual fonts. WOFF2 files were converted without subsetting using fontTools 4.60.2; no runtime font service is used.

Downloaded November 2, 2026 from the official Google Fonts repository:

- [Barlow Condensed sources](https://github.com/google/fonts/tree/main/ofl/barlowcondensed): `BarlowCondensed-Bold.ttf`, `BarlowCondensed-ExtraBold.ttf`, `BarlowCondensed-ExtraBoldItalic.ttf`. See `BARLOW-OFL.txt`.
- [DM Sans source](https://github.com/google/fonts/tree/main/ofl/dmsans): `DMSans[opsz,wght].ttf`. See `DM-SANS-OFL.txt`.

The original `display.otf`, `body.otf`, and `body-bold.otf` are retained as legacy source assets. They contain Nimbus Sans Narrow Bold and Nimbus Sans Regular/Bold; their license is retained in `LICENSE.txt`. They are no longer referenced by the runtime or offline shell.
