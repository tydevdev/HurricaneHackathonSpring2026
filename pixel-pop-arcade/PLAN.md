# Pixel Pop Arcade Finish Plan

## Current stopping point

- `pixel-pop-arcade/` is a standalone Vite + Phaser subproject.
- The arcade has three selectable games: `Space Invaders`, `Pac-Munch`, and `Snake`.
- The app includes a cabinet lobby, Phaser canvas playfield, DOM scoreboard, restart button, keyboard input, and touch controls.
- The root hub now points `Pixel Pop Arcade` to `./pixel-pop-arcade/dist/`.
- `npm install`, `npm run lint`, and `npm run build` have run successfully from `pixel-pop-arcade/`.
- Build completed with Vite's large chunk warning because Phaser ships as a large bundled dependency.

## Finish next

- Run the app in the browser and play through all three cabinet buttons.
- Verify keyboard controls:
  - Arrows or WASD move.
  - Space or Enter triggers the primary action.
  - Restart resets the active game.
- Verify touch controls on a phone-sized viewport.
- Check desktop layout around `1280x800`.
- Check mobile layout around `390x844`.
- Confirm the root hub opens `./pixel-pop-arcade/dist/` correctly.
- Decide whether to leave the Phaser bundle warning as acceptable for a hackathon demo or add lazy loading/code splitting.
- Append a final `HISTORY.md` entry after browser validation with exact checks and any fixes made.

## Nice polish

- Add tiny sound effects with a mute toggle.
- Add local high scores per game.
- Add one more cabinet, such as `Breakout` or `Frogger`, if the arcade should feel fuller.
- Add a short attract-mode loop when a game is idle.
