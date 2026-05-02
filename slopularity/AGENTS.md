# Slopularity Agents

This is the primary project for the repository. Treat it as the real build, not another experiment.

Assume future product work in this repository belongs in `slopularity/`. The other top-level folders were prototypes used to figure out the direction; use them for reference only unless the user explicitly asks to modify one.

## Project Memory

- The concept is a 2030 "everything app" after AI has supposedly unified the web into one super app.
- The product should pose as the singularity of websites: search, assistant, social, work, commerce, identity, files, automation, and personalization all under one interface.
- The commentary is that unchecked AI generation made the whole thing slop. The app should slowly fall apart as the user uses it.
- `quiet-collapse/` is the closest reference for slow trust failure. `slopternet/` is a useful reference for louder AI-slop collapse. `slopularity/` should combine the broader super-app premise with careful, interaction-driven degradation.

## Current State

- This folder now contains the first Vite/React implementation skeleton for The Singularity.
- Continue building from the existing app structure instead of starting over.
- Keep `README.md`, `PLAN.md`, `DESIGN_BIBLE.md`, and this file synchronized with major product-direction decisions.
- Use `PLAN.md` as the living idea tracker for tabs, mechanics, commentary targets, collapse stages, and first-build priorities.
- Use `DESIGN_BIBLE.md` as the living product/design execution guide: surface intentions, visual language, copy rules, collapse behavior, motion, responsive expectations, and source-narrative rules.
- Use `IMPLEMENTATION_STATUS.md` as the current-build ledger. Update it periodically during substantial work so future agents know what is actively being implemented with intention, what is still a skeleton, which feature flags are off for testing, and what validation has already run. Do not use `PLAN.md` as a changelog.

## Future Build Rules

- Before implementing or substantially changing a tab, mechanic, visual system, or narrative beat, read the relevant `DESIGN_BIBLE.md` section as well as `PLAN.md`.
- After implementing or substantially changing a section, update `DESIGN_BIBLE.md` with the intention behind the choice, how it behaves through interaction, what collapse hooks affect it, and any copy or verification notes future agents need.
- If a decision changes the project idea, update both `PLAN.md` and `DESIGN_BIBLE.md`; if it only changes execution details, update `DESIGN_BIBLE.md`.
- If a change affects the current working posture, add a concise dated note to `IMPLEMENTATION_STATUS.md`: active focus, files touched, intentional behavior, skeleton/deferred behavior, feature flags, and verification.
- When adding, changing, or removing any decay, slop, or degradation behavior, update `DECAY_FEATURES.md` with the feature name, trigger, visible effect, collapse stage, and current status. Keep this file current so future agents can scan all implemented and planned decay mechanics in one place.
- Keep each tab surface in its own file under `src/pages/` so parallel work stays clean: `FeedPage.tsx`, `FriendsPage.tsx`, `GamesPage.tsx`, `ShopPage.tsx`, `SearchPage.tsx`, `AssistantPage.tsx`, and `ProfilePage.tsx`.
- Keep shared app state, phase progression, idle handling, and popup orchestration in `src/App.tsx`; keep shared seeded copy/data in `src/content.ts`.
- Keep unfinished noisy mechanics easy to enable or disable from one obvious place. Current testing flags live in `src/featureFlags.ts`; noisy popup, idle, and degradation work should be gated there until the team is actively focusing on those features.
- Build the actual usable experience first, not a marketing landing page.
- Make user actions drive the collapse: searches, assistant prompts, feed actions, task changes, profile edits, file opens, commerce actions, or automation toggles should push the app into more broken states.
- Degradation should be legible and escalating: normal confidence, subtle contradictions, generated artifacts, duplicated surfaces, leaking internals, unreliable recovery, then an earned final reveal.
- Preserve enough usability that the user can keep exploring even while the app decays.
- Keep visible copy short, specific, and in-world. Do not add explanatory copy that describes the satire from outside the product.
- Keep verification proportional. For most changes, `npm run lint` and `npm run build` are the expected proof. Add a quick browser smoke check for the exact changed path when routing, responsive layout, asset loading, or visible UI behavior changed, but do not test every interaction unless the user explicitly asks for deeper QA.
- Append root `HISTORY.md` entries for significant sessions, including files changed, behavior impact, and validation run.
