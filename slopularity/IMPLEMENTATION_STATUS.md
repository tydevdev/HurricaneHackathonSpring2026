# Slopularity Implementation Status

Use this file as the current-build ledger. `PLAN.md` stays the idea canon. `DESIGN_BIBLE.md` stays the product/design execution guide. This file records what is actively intentional in the app right now, what is still a skeleton, and which feature flags are keeping unfinished mechanics out of the way.

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
