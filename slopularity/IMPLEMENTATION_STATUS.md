# Slopularity Implementation Status

Use this file as the current-build ledger. `PLAN.md` stays the idea canon. `DESIGN_BIBLE.md` stays the product/design execution guide. This file records what is actively intentional in the app right now, what is still a skeleton, and which feature flags are keeping unfinished mechanics out of the way.

## [2026-05-02 15:14] Games Playable + Popup / Chrome Pass

- Active focus: `GamesPage.tsx` plus shared chrome (`App.tsx`, `PopupSwarm.tsx`, `index.css`). `FeedPage.tsx` was untouched — feed sprint is owned by another agent.
- Games surface is now intentional: five playable mini-games live under `src/games/` (Snack Sort, Spot the Slop, Cozy Robot Coach, Mood Cloud Parade, Path of the Pebble). Each has cute CSS / SVG art, a sticker reward, and a stage-indexed receipt that flips from "reward: sticker pack" to a real-sounding training pipeline (`vision_label_queue.snack_v41`, `hallucination_dataset.cottage_v12`, `rlhf_preference_batch.helpful_kind_safe`, `emotion_annotation.soft_face_v3`, `segmentation_seed.path_v9`) at stage ≥ 3.
- Games tab also exposes a "today's training queue" footer that becomes more legible at higher stages and surfaces a `// AutoSprint TODO` fragment at stage 4.
- Popup dock behavior was rebuilt: real `×` close button, dock header with `Mute` / `Clear all`, bottom-LEFT placement so it no longer occludes the developer-fragments rail. The `dismiss → softer follow-up` rule is now one-shot per session and only arms at stage ≥ 3, so dismissing actually clears the dock. A user-visible "Friends muted" toggle in the appbar silences existing popups and blocks new spawns.
- Chrome simplified: the marketing-style giant H1 in the topbar is gone. Replaced with a compact `.appbar` (brand mark + tagline, fake universal-search affordance that jumps to the Search tab, phase pill, mute toggle, demo / reset buttons, avatar). Tabbar restyled to feel less SaaS-pill and more nav. `.surface` heading hierarchy toned down so non-feed pages do not shout louder than the feed.
- Feature flag posture is unchanged (`featureFlags.interruptionLayer` still `false`). The popup fixes only become visible when the flag flips on, so feed-sprint work stays uninterrupted.
- Files changed: `src/App.tsx`, `src/components/PopupSwarm.tsx`, `src/pages/GamesPage.tsx`, `src/games/*` (new), `src/index.css`. No `FeedPage.tsx` edits.
- Validation: `npm run lint` clean, `npm run build` succeeds, `dist/` regenerated and committed for GitHub Pages. Phone QA at <720px reviewed via the responsive media query (appbar collapses to a 2-row grid, tabbar stays bottom-fixed, popup dock lifts above the bottom tabbar).

## [2026-05-02 14:31] Feed Focus Pass

- Active focus: `FeedPage.tsx` is the surface currently being implemented with intention.
- Feed direction: mobile-first social feed inspired by familiar photo-feed patterns: top title bar, horizontal stories, stacked square photo posts, author rows, icon actions, captions, comments, and phone bottom navigation.
- Current satire level: calm and usable first. The critique should come through aspirational posts, sponsor texture, and engagement language before any collapse effects return.
- Feature flag: `src/featureFlags.ts` exposes `featureFlags.interruptionLayer`. It is currently `false` so unfinished popup, idle, and visible degradation behaviors do not interrupt feed work.
- Disabled while testing feed: popup swarm rendering, idle-triggered popups, dismissal follow-up popups, assistant-triggered popups, shop/search/friend manual popup spawns, and visible phase escalation.
- Still tracked underneath: interaction score still increments so future collapse work can reconnect to the plan without rebuilding the state model.
- Skeleton for later: popup friends, idle stillness detection, multi-surface collapse, late-stage source leakage, and cross-tab degradation are real planned mechanics but should stay off until each one is intentionally fleshed out.

## Update Protocol

- Add a new dated entry whenever a tab, mechanic, feature flag, or testing posture changes substantially.
- Keep entries concrete: files changed, what is intentional now, what is still skeleton, and what validation was run.
- Do not use this file for broad ideation. Put ideas in `PLAN.md`; put execution rules in `DESIGN_BIBLE.md`.
