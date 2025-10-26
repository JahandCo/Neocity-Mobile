# Copilot instructions — Neocity Mobile

This file gives concise, actionable context for an AI coding agent working on Neocity-Mobile. Keep guidance short and reference real files/examples.

## Big picture (how the app is structured)
- Single-page static browser game (ES modules). Entry: `index.html` (loads `js/main.js` as `type="module"`).
- Core runtime lives in `js/`:
  - `js/Game.js` — main game engine and state machine (states: `menu`, `character-select`, `world`, `dialogue`, `combat`). Use `changeState()` to transition.
  - `js/Dialogue.js` — scene runner: reads `js/storyData.js` (`synthyaStory`), renders dialogue UI and choices, runs `Minigames` when scenes include `minigame` or `inputPrompt`.
  - `js/CharacterSelect.js` — UI grid for selecting characters; opens overlays and triggers `dialogue.startStory()`.
  - `js/Minigames.js` — small minigame harness. `Minigames.run(def, onComplete)` creates overlays and calls `onComplete()`.
  - `js/storyData.js` — canonical story data: `scenes` map, `characters`, `effects`. Scenes may include `dialogue`, `choices`, `minigame`, `inputPrompt`, `inputAnswer`, and `onComplete` mapping.

## Key conventions and patterns to preserve
- Files are ES modules and imported via relative paths; preserve `type="module"` usage in `index.html`.
- State strings are literal and reused across files (e.g. `'world'`, `'dialogue'`). Prefer using these exact strings when changing state logic.
- Story-driven scenes: agent edits to narrative should live in `js/storyData.js` (scenes object). Keep scene IDs stable — other code references them by string.
- **Character poses for dialogue**: All character poses are in `assets/images/characters/{charactername}/poses/`. Pose files are named `{charactername}-{emotion}.png` (e.g., `synthya-happy.png`). For regular dialogue without strong emotion, use `{charactername}-speak.png`. When adding dialogue nodes, set `emotion: "speak"` for neutral dialogue, or `emotion: "happy"`, `"sad"`, `"surprise"`, etc. for emotional moments. If unsure which emotion to use, stop and ask.
- Minigame definitions appear inline in scenes (either `minigame: { type:..., onComplete:... }` or `minigame` key in a choice). `Minigames.run()` expects a simple `def` object or `type` string — follow existing patterns.
- Audio policies: playback is gated by user gesture. Global music is `#bg-music` (in `index.html`); code uses `startMenuMusic()` / `startGameMusic()` helpers. Avoid assuming autoplay.

## Developer workflows (how to run & test locally)
- To run locally: serve the directory over a static HTTP server and open `index.html` in a browser. Example quick commands (developer should run in project root):

  - Python 3 simple server:

    python3 -m http.server 8000

    Open: http://localhost:8000/

  - Or use a lightweight Node server (if Node installed):

    npx http-server -c-1 .

- Test suggestions (not yet present in repo):
  - Use Playwright for end-to-end UI tests (exercise canvas, audio, overlays). Create `tests/` and a `playwright.config.js` if adding E2E.
  - Use Vitest + jsdom for unit-testing pure logic (small helpers), but DOM-heavy canvas rendering should be E2E-tested.

## Integration points / important globals
- `document.getElementById('bg-music')` — menu music element. Code expects `muted` initially for autoplay policies.
- `new Game()` is created in `js/main.js` on `DOMContentLoaded` — most runtime attachments happen during `Game` constructor.
- `Dialogue` imports `synthyaStory` from `js/storyData.js` — any change to scene ids or characters must keep the data shape (`scenes`, `dialogue[]`, `choices[]`, `minigame`, `inputPrompt`, `inputAnswer`).

## Typical edits an agent might be asked to make (how to do safely)
- Add a new scene: add an entry under `synthyaStory.scenes` in `js/storyData.js`. Use an existing property pattern: `dialogue: [...]` and optionally `choices: [...]` or `minigame`.
- Add a new character: append to `synthyaStory.characters` with `name` and `images` mapping. Use existing `synthya`/`kael` entries as examples.
- Add new minigame type: implement `Minigames.buildX()` and call it from `Minigames.run()` by checking `def.type`. Keep UI as an overlay and call `onComplete()` when finished.
- UI changes: modify CSS under `assets/css/`. Visual effects are applied by adding classes (e.g. `effect-glitch`) in `Dialogue.applyEffects()`.

## Files to inspect for context when coding
- `index.html` — DOM layout, canvas elements, audio element id, module bootstrap
- `js/Game.js` — state machine, asset loading, scene layout math, input handling
- `js/Dialogue.js` — scene execution, choices, minigame handoff, audio helpers
- `js/Minigames.js` — examples of overlays, sfx usage, hover sound helpers
- `js/CharacterSelect.js` — example overlay pattern (close handlers, play button)
- `js/storyData.js` — canonical data model for scenes and characters
- `assets/css/landing.css` (and `style.css`) — theme variables and effect classes

## Quick rules for automated edits
- Preserve literal scene IDs and state strings. If renaming, update all references (search for the string across `js/`).
- Avoid changing asset paths unless adding new assets to `assets/`. Paths are relative and used by Image and Audio constructors.
- Respect gesture-based audio playback: only call `.play()` in response to user gestures or accept that browsers may block it.

---
If anything above is unclear or you'd like more examples (tests, E2E skeletons, or a small Vitest setup), tell me which area to expand and I will update this file.
