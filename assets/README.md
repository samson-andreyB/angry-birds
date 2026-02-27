Asset structure:

- `assets/embedded/` - active runtime assets used by `AngryBirdsGame.js`.

How to replace assets:

- Keep the same filenames when replacing images/audio.
- If you rename files, update corresponding paths in `AngryBirdsGame.js`.
- Use hard refresh (`Ctrl+F5`) after replacement.

Run note:

- Start game via HTTP (`http://...`), not `file://`, to avoid browser CORS/service-worker restrictions.
