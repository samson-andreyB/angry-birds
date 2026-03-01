Asset structure:

- `assets/img/` - runtime images grouped by screen and feature.
- `assets/audio/` - external audio files used by the game.
- `assets/fonts/` - local fonts loaded by `AngryBirdsGame.htm`.

How to replace assets:

- Keep the current filenames inside each new folder.
- If you rename files, update corresponding paths in `AngryBirdsGame.js` or `AngryBirdsGame.htm`.
- Use hard refresh (`Ctrl+F5`) after replacement.

Run note:

- Start game via HTTP (`http://...`), not `file://`, to avoid browser CORS/service-worker restrictions.
