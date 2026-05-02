# History

## [2026-05-02 11:43] Prepare Initial Repo Commit

- Expanded root `.gitignore` to cover macOS/editor noise, local env files, logs, dependency folders, local tool state, and caches while keeping Vite `dist/` output trackable for GitHub Pages demos.
- Confirmed the repo is on `main`, has no prior commits, and points at `origin` `https://github.com/tydevdev/HurricaneHackathonSpring2026.git`.
- Checked for obvious secret-looking content before staging; matches were normal package names, prose, or application code identifiers.

## [2026-05-02 11:42] Stop With Pixel Pop Arcade Playable Draft

- Created `pixel-pop-arcade/` as a standalone Vite + Phaser experiment with package files, TypeScript configs, favicon, source files, and built `dist/` output.
- Built a cutesy retro arcade shell with selectable `Space Invaders`, `Pac-Munch`, and `Snake` games, plus keyboard input, touch controls, restart, scoreboard, and responsive styling.
- Updated root `index.html` so `Pixel Pop Arcade` is now a live tile pointing to `./pixel-pop-arcade/dist/`.
- Added `pixel-pop-arcade/PLAN.md` with remaining browser QA, root click-through validation, and polish ideas.
- Validation run so far: `npm install`, `npm run lint`, and `npm run build` inside `pixel-pop-arcade/`; browser desktop/mobile validation is still pending.

## [2026-05-02 12:02] Add Fun Internet Museum Demo

- Created `fun-internet-museum/` as an independent React/Vite subproject with its own package, TypeScript, ESLint, Vite config, favicon, and source files.
- Built `fun-internet-museum/src/App.tsx` and `fun-internet-museum/src/index.css` into a 2013/2014-style internet museum with 40+ exhibits, search, category filters, random exhibit surfacing, external field-trip links, collectible stamps, fake popups, a guestbook, meme captioning, ASCII sign making, a chatbot toy, a webring prompt, a question vault, and a do-not-touch button.
- Updated root `index.html` so Fun Internet Museum is a live project tile pointing to `./fun-internet-museum/dist/`.
- Updated `AGENTS.md` repository-shape notes so the new subproject is listed as an independent Vite project.
- Validated from `fun-internet-museum/` with `npm install`, `npm run build`, `npm run lint`, and a quick Browser/IAB pass against `http://127.0.0.1:5178/` confirming the page loads and the randomizer, do-not-touch button, and popup toy update visible state.

## [2026-05-02 11:19] Require Subagents for Image Generation

- Updated `AGENTS.md` so image generation work must be delegated to subagents instead of handled directly by the main agent.
- Clarified that the main agent may direct, review, and integrate generated assets while leaving actual generation to subagents.
- Validated the markdown update by inspecting the edited files.

## [2026-05-02 11:18] Strengthen Subagent Policy

- Updated `AGENTS.md` with a new `Subagent Acceleration` section that makes subagents the default speed tool for actionable work.
- Clarified when to split work across subagents, including exploration, implementation slices, verification, design critique, test review, risk hunting, and cleanup.
- Preserved the existing parallel-agent stability rules so future agents still protect unrelated in-progress work.
- Validated the markdown update by inspecting the edited files.

## [2026-05-02 11:08] Add Hackathon Root Hub

- Created root `AGENTS.md` with hackathon workspace guidance, GitHub Pages root rules, subproject boundaries, maintenance expectations, and parallel-agent collaboration policy.
- Created this `HISTORY.md` and documented the required append-only history format.
- Added a static root GitHub Pages hub in `index.html` with companion styling in `styles.css`.
- Added a root `favicon.svg` and `.gitignore` for local verification artifacts.
- Linked the root hub to the published subproject folders without editing their internal pages.
- Validated the root page locally through a static server and browser pass.

## [2026-05-02 11:22] Fix Published Subproject Links

- Updated root `index.html` to link published projects to their built `dist/` pages instead of Vite source folders.
- Set `base: './'` in the Vite configs for `365 buttons`, `time-capsules`, and `scrollbreak` so built assets resolve from nested GitHub Pages folders.
- Rebuilt all three subprojects and kept `dist/` eligible for Git tracking by removing the Vite template `dist` ignore rule.
- Fixed `scrollbreak/src/App.tsx` build blockers by removing an unused `Send` import and confirming its CSS file was available before rebuilding.
- Validated the root-to-`365 Buttons` click-through in the in-app browser and confirmed the rendered page loaded with no console errors.

## [2026-05-02 11:25] Refresh Hub Repo State

- Updated root `index.html` so the project arcade reflects the current top-level folders: live `time-capsules`, `365 buttons`, and `scrollbreak`; source-only `pocket-zoo`; queued `whimsy-net`.
- Removed the stale `Fun Idea` tile because that folder is no longer present.
- Updated `styles.css` with flexible project-grid sizing plus distinct Pocket Zoo and Whimsy Net tile art.
- Updated `AGENTS.md` repository-shape notes to match the current Vite projects and idea folder.
- Validated the refreshed hub in the browser from the running local static server.

## [2026-05-02 11:30] Upgrade Root Hub Art Direction

- Generated a nostalgic 90s hackathon desk hero image with the built-in image generation tool and copied it into `assets/hackathon-desk.png`.
- Reworked `index.html` hero copy, status lines, project statuses, and current project list so `pocket-zoo` is live and `fun-internet-museum` appears as a scaffold shelf.
- Built `pocket-zoo/dist/` after installing its missing package lock so the root link resolves to a real static page.
- Added `pocket-zoo/.gitignore` that keeps `node_modules` out while allowing the Pages-ready `dist/` output to be tracked.
- Preserved the newly live `fun-internet-museum/dist/` page in the hub and added `pixel-pop-arcade`, `slopternet`, and `quiet-collapse` as scaffold shelves after checking their current contents.
- Added `pocket-zoo/.gitignore` and `pixel-pop-arcade/.gitignore` so dependency folders stay local while future build outputs can be tracked.
- Updated `styles.css` with the generated image hero, stronger project launch tiles, live/scaffold status badges, Pixel Pop tile art, and responsive project-grid polish.

## [2026-05-02 11:27] Add Demo Quality Rules

- Updated `AGENTS.md` with a new `Demo Quality` section that requires demos to feel polished, well fleshed out, and built with care.
- Added explicit website standards for desktop and phone layouts, including responsive spacing, readable text, and no hidden critical controls.
- Added interaction requirements for both computer and phone use, including mouse, keyboard where relevant, touch targets, scrolling, forms, buttons, menus, gestures, and game controls.
- Required practical desktop and phone viewport validation for website work and documenting that validation in `HISTORY.md`.
- Validated the markdown update by inspecting the edited files.

## [2026-05-02 11:29] Note Transparent Image Generation

- Updated `AGENTS.md` so image-generation direction can explicitly request `transparent background` when assets should have no backdrop.
- Clarified that the image generator can return transparent-background images when asked.
- Validated the markdown update by inspecting the edited files.

## [2026-05-02 11:30] Add Pocket Zoo

- Created `pocket-zoo/` as a separate Vite React experiment with its own package files, source files, favicon, and build flow.
- Added twelve subagent-generated cartoon animal cutouts in `pocket-zoo/public/animals/` and converted the chroma-key backgrounds to transparent PNGs.
- Built an interactive habitat in `pocket-zoo/src/App.tsx` with drag-and-flick animals, boops, snack drops, gather mode, breeze mode, lineup/reset controls, and status feedback.
- Styled the habitat in `pocket-zoo/src/App.css` and `pocket-zoo/src/index.css` with a full-screen toy-room layout, responsive controls, motion, and reduced-motion handling.
- Linked `Pocket Zoo` from the root `index.html` as a published `dist/` page.
- Validation run: `npm install`, `npm run lint`, `npm run build`, alpha-channel asset QA, built preview in Browser at `127.0.0.1:5177`, boop/treat/breeze/reset and drag checks, mobile viewport screenshot at `390x844`, and root hub click-through from `127.0.0.1:5180`.

## [2026-05-02 11:36] Add Slopternet Idea Plan

- Created `slopternet/` as a top-level idea folder for a website-first, game-like interactive critique of AI slop and internet instability.
- Added `slopternet/PLAN.md` detailing the concept arc, Welcome Home-inspired interaction pattern, staged site degradation, core controls, visual direction, and future Vite React build approach.
- Left the root hub unchanged because `slopternet/` is only a planning folder and has no published `dist/` page yet.
- Validation run: confirmed only `slopternet/PLAN.md` exists, inspected the plan document, and inspected this append-only history entry.

## [2026-05-02 11:39] Split AI Web Collapse Variations

- Edited `slopternet/PLAN.md` so it is the instant-AI-slop variation: obviously generated from the first screen, then increasingly unstable through interaction.
- Created `quiet-collapse/PLAN.md` as a second top-level idea folder for the subtle variation: a normal, trustworthy-looking website that slowly becomes creepy, contradictory, and unreliable.
- Kept both folders planning-only with no Vite scaffold, no committed build output, and no root hub links.
- Validation run: inspected both plan documents and confirmed the top-level plan files are present.

## [2026-05-02 12:18] Build Slopternet & Quiet Collapse From Plans

- Created `slopternet/` as a full Vite + React + TS subproject (package.json, tsconfig.{app,node}.json, vite.config.ts with `base: './'`, eslint flat config, .gitignore, favicon, index.html, src/main.tsx, src/state.ts, src/App.tsx, src/index.css). Implemented a glossy AI-SaaS landing page ("Future-Ready Synergy Cloud") that degrades through five stages driven by a hidden instability score persisted to localStorage: a polished hero with cycling "Generate Better Copy" headline variants, a 3D dashboard preview with "Optimize Layout" / "Refresh" controls that drift bars and KPIs, fake-logo trust strip, six feature cards that duplicate and leak `[verify before publishing]` comments at later stages, fake stats, a testimonial carousel that fades into ghost copies, three pricing tiers with corrupting copy, a "Loop" chatbot whose tone progresses from helpful → confidently wrong → contradictory → leaking system-prompt fragments → admitting it cannot verify itself, a returning cookie banner with five escalating variants, a search modal whose results expose `/admin/internal/safe-answer-v4-final-final.md` style hidden pages at stage 4, an auto-multiplying footer policy list, a cursor-avoidant "Fix Website" button at stage 4+, a stage-indexed page-title drift, and a final readable warning ("The web does not break all at once. It breaks every time nobody checks what was generated.").
- Created `quiet-collapse/` as a parallel Vite + React + TS subproject with the same shape. Implemented a calm civic resources portal ("Westridge County · Community Resources") that quietly stops agreeing with itself: a sticky header with a county seal, an active-advisory banner, an emergency hotline aside, six resource cards (72-hour kit, evacuation routes, boil-water guidance, mental-health hotlines, pets-at-shelters, family reunification) whose body copy, source citations, and update timestamps drift into placeholders, a six-question FAQ where repeated opens of the same item cycle through stage-indexed contradictory variants, an update log that swaps to a duplicated/autogenerated set at stage 3, a contact form whose success message reveals an "internal note (autogenerated)" routing line and a "still unsent" status at later stages, a "Wren" assistant whose voice walks from civic → confidently uncertain → leaking system prompt → admitting it summarizes summaries, a search dialog that exposes `/drafts/safe-answer-v4-final-final.md` and other internal-machinery pages at stage 4, a calm footer that flips its "last reviewed by" line to `pending`, and a final readable note ("The internet does not have to look broken to stop being reliable.").
- Both subprojects share a `useInstability` hook: bumping interactions raises a score, thresholds map to stages 1–5, and a continuous `--instability` / `--drift` CSS variable feeds layout decay. Both ship a `↺ reset` corner button (localStorage clear) and respect `prefers-reduced-motion`.
- Updated root `index.html` so `Slopternet` and `Quiet Collapse` are now `is-live` tiles linking to their `dist/` pages, refreshed the terminal `live builds` count from 6 to 8 and `scaffold shelves` from 3 to 1, and updated the "Choose a doorway" section note to match.
- Validation run: `npm install`, `npm run lint`, and `npm run build` succeed for both `slopternet/` and `quiet-collapse/`; both `dist/index.html` files render with relative `./assets/...` paths suitable for GitHub Pages; static `python -m http.server` confirmed both built pages return 200 from `./slopternet/dist/` and `./quiet-collapse/dist/`. Browser viewport QA at desktop and phone widths is still pending and should be recorded in a follow-up entry.

## [2026-05-02 12:56] Upgrade Quiet Collapse Trust-Failure Demo

- Updated `quiet-collapse/src/state.ts` with slower stage thresholds, a longer final-warning runway, and specific discovery IDs for source drift, stale summaries, review conflicts, hotline drift, fake citations, and related artifacts.
- Updated `quiet-collapse/src/App.tsx` so stage 1 stays more credibly civic, normal navigation actually moves to sections, mobile has a menu plus visible search, hero search gives feedback, and the reset control stays hidden until the illusion has already begun to break.
- Added resource guide drawers in `quiet-collapse/src/App.tsx` with page paths, department labels, review claims, duplicate generated pages, invisible editorial notes, changed hotline details, and fake citation-shaped records.
- Added a surfaced review queue in `quiet-collapse/src/App.tsx` so contradictions discovered through search, FAQ, assistant replies, update log entries, resource cards, and contact form outcomes become a playable investigation trail instead of hidden state.
- Updated `quiet-collapse/src/index.css` for the new guide drawer, inline search result, review queue, responsive mobile menu/search behavior, and the fixed final-message overlay; removed the shell-level filter that caused fixed overlays to anchor to the scrolled page.
- Rebuilt `quiet-collapse/dist/index.html` and generated new `quiet-collapse/dist/assets/index-*.css` and `quiet-collapse/dist/assets/index-*.js` output for GitHub Pages.
- Validation run from `quiet-collapse/`: `npm install`, `npm run lint`, and `npm run build`.
- Browser validation run at `http://127.0.0.1:5175/`: desktop stage 1 screenshot confirmed restrained, trustworthy civic framing with no visible reset or parody; interacted with search, FAQ, assistant, update log, resource cards, and contact form; confirmed deterministic late-stage discoveries for source drift, stale generated summaries, duplicate pages, invisible editorial notes, review conflicts, changed hotline/contact details, fake citations, and prompt leakage; confirmed final message appears centered and clearly warns about careless automation and AI overreliance.
- Phone validation run at `390x844`: confirmed no horizontal overflow, visible Search and Menu controls, usable search results, FAQ interaction, contact form visibility, and credible first-stage layout. Reduced-motion emulation loaded the page with `prefers-reduced-motion: reduce` active.

## [2026-05-02 12:56] Upgrade Slopternet Collapse Prototype

- Rebuilt  into a louder AI-slop landing experience with an obviously generated SaaS first viewport, fake trust badges, fake dashboard, corruptible nav/search/chat/testimonial/pricing/footer/dashboard interactions, staged copy/layout/prompt degradation, recovered hidden artifacts, phantom pages, wrong-but-confident responses, and a protected final warning about unchecked generated web systems.
- Reworked  for stronger glossy slop art direction, responsive desktop/phone layouts, authored visual collapse, duplicated component ghosts, fake loading overlays, unstable cards, protected final-warning styling, keyboard focus states, and reduced-motion safeguards.
- Expanded  discovery IDs so the new artifacts are tracked through the existing hidden instability/discovery model.
- Rebuilt the published static output in , , and  for GitHub Pages serving.
- Validation run:  inside  to restore local dependencies,
> openai-codex-electron@26.409.20454 lint
> pnpm exec oxlint --threads=1 --tsconfig ./tsconfig.json --max-warnings 0 --type-aware --type-check,
> openai-codex-electron@26.409.20454 build
> rm -rf out && PNPM_YES=true pnpm run forge:make, served  with , and ran a Chromium browser QA pass at  and  that confirmed the first viewport starts as AI slop, the desktop and phone interaction paths reach the final warning, no browser console/page errors were reported, and screenshots were captured at  and .

## [2026-05-02 12:56] Correct Slopternet Upgrade History Entry

- Corrected the immediately preceding malformed shell-expanded history details for the Slopternet collapse upgrade; the actual source files changed were `slopternet/src/App.tsx`, `slopternet/src/index.css`, and `slopternet/src/state.ts`.
- Confirmed the published build output was regenerated by `npm run build` as `slopternet/dist/index.html`, `slopternet/dist/assets/index-BB_bwSud.css`, and `slopternet/dist/assets/index-yME3mJ_8.js`.
- Actual behavior impact: Slopternet now opens as an obviously AI-generated glossy SaaS page, then degrades authored surfaces for copy, layout, trust badges, navigation, search, chatbot, testimonials, pricing, footer, and dashboard into prompt leaks, phantom pages, duplicated cards, generated legal links, wrong-but-confident answers, recovered artifacts, and a protected final warning about overreliance on unchecked AI-generated web systems.
- Actual validation run: `npm install` inside `slopternet/` restored local dependencies; `npm run lint` passed; `npm run build` passed; `python3 -m http.server 4210 --bind 127.0.0.1` served the built `slopternet/dist/` output; Chromium browser QA passed at desktop `1440x950` and phone `390x844`, including click-through to the final warning, first-screen AI-slop confirmation, final-warning confirmation, no console/page errors, and screenshots captured at `/tmp/slopternet-desktop.png` and `/tmp/slopternet-phone.png`.
