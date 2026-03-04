Asset structure:

- `assets/img/` - runtime images grouped by screen and feature.
- `assets/audio/` - external audio files used by the game.
- `assets/fonts/` - local fonts loaded by `KolobokGame.html`.

How to replace assets:

- Keep the current filenames inside each new folder.
- If you rename files, update corresponding paths in `KolobokGame.js` or `KolobokGame.html`.
- Use hard refresh (`Ctrl+F5`) after replacement.

Run note:

- Start game via HTTP (`http://...`), not `file://`, to avoid browser CORS/service-worker restrictions.
