# Slopularity Implementation Status

Use this file as the current-build ledger. `PLAN.md` stays the idea canon. `DESIGN_BIBLE.md` stays the product/design execution guide. This file records what is actively intentional in the app right now, what is still a skeleton, and which feature flags are keeping unfinished mechanics out of the way.

## [2026-05-02 18:32] Phone Vertical Multi-Scroll

- Active focus: `FeedPage.tsx` phone portrait behavior after `DOUBLE SCROLL` / `TRIPLE SCROLL` unlocks.
- Behavior changed: phone-sized viewports now keep multi-scroll active instead of suppressing it; the extra lanes interleave vertically as full-width post stacks.
- Responsive intent: desktop/tablet widths still use horizontal two/three-lane multi-scroll, while phone portrait preserves full-size author rows, action chips, comments, and image widths.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, `DECAY_FEATURES.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; Playwright smoke against `vite preview` at 390x844 forced stored `scrollMode: "triple"` and confirmed 30 vertical stacks with three full-width posts each, no `.double-scroll-lane` nodes, 374px feed/post/photo/image widths, 34px action chips, and no horizontal overflow; then forced `scrollMode: "double"` and confirmed 36 vertical stacks with two posts each and no horizontal overflow.

## [2026-05-02 18:33] Idle Eye And Nudge Rotation

- Active focus: the inactivity surveillance layer in `App.tsx`, `IdleEye.tsx`, `LonelinessPopup.tsx`, and `index.css`.
- Behavior changed: the idle eye now appears after 5 seconds instead of 10, sits in the center of the screen, and uses a large CSS eye with a pulsing red pupil.
- Behavior changed: the center-bottom idle popup now appears after 7 seconds and rotates through six variants: paused-user matches, new post recommendation, clickbait article, fake friend text, hesitation discount, and assistant decision nudge.
- Behavior changed: ambient tab reorganization moved earlier to 9 seconds so the idle cascade feels faster.
- Documentation updated: `DECAY_FEATURES.md`, `DESIGN_BIBLE.md`, and root `HISTORY.md`.
- Validation run: `npm run lint`; `npm run build`. A local Chrome idle smoke was attempted, but headless Chrome hung before returning DOM evidence; the Vite server was shut down afterward.

## [2026-05-02 16:25] Batch Decay Features — Friends, Search, Games, Idle

- Active focus: 10 new decay/slop features across Friends, Search, Games, and Idle surfaces.
- New file: `src/activityLog.ts` — session-only cross-tab activity tracker (module-level array, no localStorage).
- New file: `src/components/IdleEye.tsx` — CSS-drawn eye that appears after 10s idle, blinks, follows cursor.
- New file: `src/components/LonelinessPopup.tsx` — center-bottom card with 3 fake "matches" who are brand ambassadors.
- Friends: interactive chat input per friend card, 3-rung emotional upsell ladder (empathy → product mention → full pitch), cross-tab memory references from activityLog, Devon/Jules friend merge at stage 3-4, script leak JSON at stage 4.
- Search: personalized result poisoning — 1-3 injected results based on cross-tab activity, 30% about query / 70% product push, orange border accent.
- Games: reward devaluation (sticker pack → 0.3 credits → 0.003 credits / 47k required → 0.00004 credits ETA 11.7 years), progress percentage in stats row.
- Games/SnackSort: game-becomes-work — tracks rounds played, round 2+ removes emoji/cute labels, round 3+ adds timer and quota, round 4+ makes submit "mandatory" and play again becomes "Next batch →". Music note "🎵 cozy sorting time" stays cheerful.
- App.tsx: 4-tier idle detection (eye at 10s, tab reorg at 12s, loneliness popup at 15s, friend popup at 18s). Activity log pushes on tab switch, search submit, game complete, assistant ask.
- CSS: friend chat input/bubbles/merge/script-leak, search poisoned result accent, SnackSort work-mode header/timer/clinical styles, idle eye with blink animation, loneliness popup card + match avatars, responsive @ 640px, reduced-motion fallbacks.
- Documentation: DECAY_FEATURES.md updated with all 10 features and corrected popup statuses. DESIGN_BIBLE.md with 5 new sections. HISTORY.md appended.
- Files changed: `src/activityLog.ts` (new), `src/components/IdleEye.tsx` (new), `src/components/LonelinessPopup.tsx` (new), `src/App.tsx`, `src/pages/FriendsPage.tsx`, `src/pages/SearchPage.tsx`, `src/pages/GamesPage.tsx`, `src/games/index.ts`, `src/games/SnackSort.tsx`, `src/index.css`, `DECAY_FEATURES.md`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`.
- Validation run: `npm run lint` clean; `npm run build` clean.

## [2026-05-02 16:20] Phone Feed Scroll Guard

- Active focus: `FeedPage.tsx` phone-width rendering after `DOUBLE SCROLL` / `TRIPLE SCROLL` has been unlocked.
- Bug fixed: phone-sized viewports now render the feed as one full-width column even if the session scroll mode is stored as double or triple, preventing cramped side-by-side lanes and zoomed-in scrolling on mobile.
- Build/lint blockers fixed: renamed the unused `FriendsPage.tsx` ladder parameter so TypeScript production builds pass again, and moved the `SnackSort.tsx` elapsed reset out of the timer effect so ESLint passes.
- Files changed: `src/pages/FeedPage.tsx`, `src/pages/FriendsPage.tsx`, `src/games/SnackSort.tsx`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; direct headless Chrome/CDP smoke at 390x844 forced stored `scrollMode: "triple"` and confirmed one 374px feed column, zero `.double-scroll-lane` nodes, first post/photo/image all 374px wide, and no horizontal overflow.

## [2026-05-02 16:00] Onboarding Gate Sequence

- Active focus: landing page rebuilt as a single-screen onboarding gate with 3-click degradation.
- Behavior changed: the full marketing manifesto (pillars, marquee, stats, preview window, manifesto quote, second CTA, footer links) has been stripped. The landing is now one focused screen with the brand bar, headline, subtitle, and one "Enter the Singularity" button.
- Behavior changed: click 1 shuffles UI element order and repositions the button (fake page navigation with blink). Click 2 garbles the tagline to "Everything you before. Need you need you know it." and makes the button visibly crooked. Click 3 triggers a hinge-fall animation where the entire page swings off screen, then Helpy appears in the bottom-right with a rescue link to `/app/`.
- New documentation: `DECAY_FEATURES.md` created as a living tracker of all implemented decay/slop features. `AGENTS.md` (both root and slopularity) updated to require periodic updates to this doc.
- Files changed: `src/pages/LandingPage.tsx` (rewritten), `src/index.css` (gate layout, hinge-fall keyframe, Helpy rescue styles added), `DESIGN_BIBLE.md` (Onboarding Gate section added), `DECAY_FEATURES.md` (new), `AGENTS.md` (updated), root `AGENTS.md` (updated), root `HISTORY.md` (appended).
- Validation run: `npm run lint` clean; `npm run build` clean.

## [2026-05-02 16:05] Search Surface Overhaul

- Active focus: `SearchPage.tsx` and Search-specific responsive styling in `index.css`.
- Search direction: a focused universal-command surface, not a generic result pile. The page now centers one big command hero, a synthesized answer, scope lenses, a ranking signal rail, a source chain, and four ranked rows that blur friends, products, sources, and memory.
- Behavior changed: submitting the search, using prompt chips, changing scopes, refreshing the answer, showing sources, or choosing a result all route through the shared `onSearch` instability event.
- Stage behavior: phase 1 reads clean and powerful; phase 2 blends personal context; phase 3 exposes sponsored ranking and circular source hints; phase 4 leaks `/internal/generated/sources-that-cite-themselves.md`.
- Files changed: `src/pages/SearchPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; Chrome DevTools Protocol checked the built `/app/search/` route at 390px mobile emulation with no document horizontal overflow.

## [2026-05-02 15:58] Feed Story Viewer Render Fix

- Active focus: feed story viewer rendering and modal dismissal.
- Bug fixed: the three-slide story track now translates by one slide width instead of the full 300% track width, so the active story image stays in the visible frame.
- Behavior changed: clicking the dark backdrop outside the story viewer closes stories; close and Escape share the same cleanup path.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; temporary Playwright smoke at 390x844 opened `/app/`, opened Mira's story, confirmed the active story image rendered with real dimensions, clicked the backdrop, confirmed `.story-viewer` closed, and checked no horizontal overflow or console/page errors.

## [2026-05-02 15:47] Feed Deep-Scroll Performance

- Active focus: `FeedPage.tsx` deep-scroll responsiveness and feed unlock stability.
- Behavior changed: the feed now keeps a bounded live render window per lane instead of mounting every repeated canonical post as scrolling continues.
- Behavior changed: feed/story images use lazy loading and async decoding, and the loop loader is capped by the effective render window so bottom scrolling cannot grow DOM work forever.
- Behavior changed: the `DOUBLE SCROLL` / `TRIPLE SCROLL` unlock check now watches the next target post with a throttled single-target geometry check, preserving the upsell triggers without observing every rendered post.
- Files changed: `src/pages/FeedPage.tsx`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; headless Chrome DevTools checks entered the app, confirmed lazy images, triggered DOUBLE and TRIPLE scroll, verified capped live card counts in single/double/triple modes, deep-scrolled to the bottom repeatedly without unbounded DOM growth, and confirmed no horizontal overflow at 1280x900 or 390x844.

## [2026-05-02 15:43] Feed Comment Sheet Revamp

- Active focus: `FeedPage.tsx` comment experience and responsive modal behavior.
- Behavior changed: tapping `View all ... comments`, `Open thread`, or a post menu comment action now opens a focused comments sheet instead of expanding the small inline drawer.
- Comment sheet now includes a post context strip, Trusted/Newest/Sponsored sorting, a thread confidence strip, quick replies, per-comment `Helpful` / `Human?` / `Ad?` toggles, a draft-to-product signal preview, and the existing brand-safe auto-reply path after submitting a comment.
- Responsive behavior: desktop renders the comment sheet as a centered overlay; phone-sized viewports render it as a bottom sheet with constrained height and no document horizontal overflow.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; local Playwright/Chromium checks at 1280x900 and 390x844 confirmed opening the comments dialog, sorting, quick reply submission, generated brand reply, `Human?` toggle, no horizontal overflow, and zero captured console/page errors. Screenshots: `/tmp/slopularity-comments-desktop.png`, `/tmp/slopularity-comments-phone.png`.

## [2026-05-02 15:33] Page URL Routing

- Active focus: app-level route handling for the Slopularity surfaces.
- Behavior changed: the landing page remains at the Slopularity root, while Feed, Friends, Games, Shop, Search, Assistant, and Profile each resolve from their own clean `/app/<page>/` URL.
- Behavior changed: the tabbar and appbar search affordance now render as real links with `aria-current`, while click handling still increments instability.
- Build output changed: `npm run build` now runs `scripts/create-route-pages.mjs` so published `dist/app/<route>/index.html` pages exist for GitHub Pages/direct-link refreshes.
- Validation run: `npm run lint`; `npm run build`; deeper interaction QA intentionally skipped per current repository testing guidance.

## [2026-05-02 15:27] Feed Story Drag Smoothing

- Active focus: story carousel drag behavior in `FeedPage.tsx` and `index.css`.
- Behavior changed: the story viewer now renders previous, current, and next slides in one horizontal track, so dragging reveals the neighboring story instead of moving a single image against empty space.
- Behavior changed: the auto-advance timer pauses while the user is dragging, then resumes after release; short left/right third taps still navigate without visible Previous/Next controls.
- Validation run: `npm run lint`; `npm run build`; headless Chrome DevTools checks at desktop and 390px confirmed three rendered story slides, changing transform during drag, drag-to-next, left/right third taps, 3s progress, no visible Previous/Next controls, no horizontal overflow, and zero captured runtime errors.

## [2026-05-02 15:03] Feed Reactions And Comments Pass

- Active focus: `FeedPage.tsx` reaction language and per-post comment behavior.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `src/App.tsx`, `src/utils.ts`, `PLAN.md`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/` output.
- Behavior changed: `Jealousy`, `Cancel`, and `This offends me` are now real per-post reactions with pressed states and counts instead of share/context/save-style controls. Buy Context is removed from the feed UI and stage labels.
- Comment behavior changed: every post now shows a comment section by default with preview comments, expansion, and local submission that adds the user comment plus the compromised brand reply.
- Validation run: `npm run lint`; `npm run build`; isolated Playwright desktop check at `1280x900` verified three reaction chips, active pressed states for `Cancel` and `This offends me`, no visible Buy Context/Share text, expanded comments, and local comment submission; isolated Playwright mobile check at `390x844` verified three reaction chips, visible comment input, no Buy Context text, no horizontal overflow, and zero captured console/page errors. Screenshots: `/tmp/slopularity-feed-reactions-desktop.png`, `/tmp/slopularity-feed-reactions-mobile.png`.

## [2026-05-02 15:05] Feed Story Carousel Pass

- Active focus: feed stories now behave like a phone-native carousel rather than a modal with explicit previous/next controls.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/` output.
- Behavior changed: the story progress line fills over three seconds, then advances to the next story with wraparound.
- Behavior changed: the visible Previous/Next controls were removed; the left third and right third of the story image now move backward/forward, while pointer dragging lets the current image slide before committing to the next story.
- Validation run: `npm run lint`; `npm run build`; headless Chrome DevTools checks at desktop and 390px confirmed no visible Previous/Next controls, the 3s progress animation, auto-advance, left/right third taps, drag-to-next, no horizontal overflow, and zero captured runtime errors.

## [2026-05-02 15:15] Feed Triple Scroll Unlock

- Active focus: `FeedPage.tsx` scroll-depth unlocks and the subscription-style confetti modal.
- Behavior changed: the feed now uses one scroll-mode state (`single` -> `double` -> `triple`) instead of a one-off double-scroll flag.
- Behavior changed: seeing the tenth post opens the DOUBLE SCROLL trial; after accepting and scrolling another ten-post-equivalent depth, the same modal opens the TRIPLE SCROLL trial and accepting it renders three feed lanes.
- Bug fixed: confetti pieces no longer rely on unsupported CSS custom-property multiplication inside `calc()`. Each piece receives concrete custom properties for left position, hue, drift, spin, and delay, so computed styles resolve in Chromium.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; local Playwright script against `http://127.0.0.1:5177/` at 1280x900 and 390x844 confirmed DOUBLE SCROLL unlock, TRIPLE SCROLL unlock after the next scroll interval, three lanes after acceptance, no horizontal overflow, computed confetti positions/colors, and zero captured page errors.

## [2026-05-02 15:14] Games Playable + Popup / Chrome Pass

- Active focus: `GamesPage.tsx` plus shared chrome (`App.tsx`, `PopupSwarm.tsx`, `index.css`). `FeedPage.tsx` was untouched — feed sprint is owned by another agent.
- Games surface is now intentional: five playable mini-games live under `src/games/` (Snack Sort, Spot the Slop, Cozy Robot Coach, Mood Cloud Parade, Path of the Pebble). Each has cute CSS / SVG art, a sticker reward, and a stage-indexed receipt that flips from "reward: sticker pack" to a real-sounding training pipeline (`vision_label_queue.snack_v41`, `hallucination_dataset.cottage_v12`, `rlhf_preference_batch.helpful_kind_safe`, `emotion_annotation.soft_face_v3`, `segmentation_seed.path_v9`) at stage ≥ 3.
- Games tab also exposes a "today's training queue" footer that becomes more legible at higher stages and surfaces a `// AutoSprint TODO` fragment at stage 4.
- Popup dock behavior was rebuilt: real `×` close button, dock header with `Mute` / `Clear all`, bottom-LEFT placement so it no longer occludes the developer-fragments rail. The `dismiss → softer follow-up` rule is now one-shot per session and only arms at stage ≥ 3, so dismissing actually clears the dock. A user-visible "Friends muted" toggle in the appbar silences existing popups and blocks new spawns.
- Chrome simplified: the marketing-style giant H1 in the topbar is gone. Replaced with a compact `.appbar` (brand mark + tagline, fake universal-search affordance that jumps to the Search tab, phase pill, mute toggle, demo / reset buttons, avatar). Tabbar restyled to feel less SaaS-pill and more nav. `.surface` heading hierarchy toned down so non-feed pages do not shout louder than the feed.
- Feature flag posture is unchanged (`featureFlags.interruptionLayer` still `false`). The popup fixes only become visible when the flag flips on, so feed-sprint work stays uninterrupted.
- Files changed: `src/App.tsx`, `src/components/PopupSwarm.tsx`, `src/pages/GamesPage.tsx`, `src/games/*` (new), `src/index.css`. No `FeedPage.tsx` edits.
- Validation: `npm run lint` clean, `npm run build` succeeds, `dist/` regenerated and committed for GitHub Pages. Phone QA at <720px reviewed via the responsive media query (appbar collapses to a 2-row grid, tabbar stays bottom-fixed, popup dock lifts above the bottom tabbar).

## [2026-05-02 15:03] Feed Post Overflow Menu

- Active focus: `FeedPage.tsx` and the feed overflow affordance.
- Behavior changed: each post's top-right three-dot button now opens an anchored submenu with `cancel`, `envision as yourself with AI`, `open comments`, and `not today`.
- Intentional routing: `cancel` sets the matching reaction, `envision as yourself with AI` preloads Helpy with that post, and `open comments` opens the bot-comment section.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/`.
- Validation run: `npm run lint`; `npm run build`; headless Chromium checks at 1280px and 390px confirmed menu labels, reaction toggles, Helpy preselection, no mobile horizontal overflow, and zero captured runtime errors.

## [2026-05-02 14:31] Feed Focus Pass

- Active focus: `FeedPage.tsx` is the surface currently being implemented with intention.
- Feed direction: mobile-first social feed inspired by familiar photo-feed patterns: top title bar, horizontal stories, stacked square photo posts, author rows, icon actions, captions, comments, and phone bottom navigation.
- Current satire level: calm and usable first. The critique should come through aspirational posts, sponsor texture, and engagement language before any collapse effects return.
- Feature flag: `src/featureFlags.ts` exposes `featureFlags.interruptionLayer`. It is currently `false` so unfinished popup, idle, and visible degradation behaviors do not interrupt feed work.
- Disabled while testing feed: popup swarm rendering, idle-triggered popups, dismissal follow-up popups, assistant-triggered popups, shop/search/friend manual popup spawns, and visible phase escalation.
- Still tracked underneath: interaction score still increments so future collapse work can reconnect to the plan without rebuilding the state model.
- Skeleton for later: popup friends, idle stillness detection, multi-surface collapse, late-stage source leakage, and cross-tab degradation are real planned mechanics but should stay off until each one is intentionally fleshed out.

## [2026-05-02 14:53] Feed Expansion Pass

- Active focus: expanded the implemented feed from 20 to 50 canonical posts.
- Files changed: `src/content.ts`, `src/pages/FeedPage.tsx`, `src/assets/feed/post-21.jpg` through `post-50.jpg`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, and root `HISTORY.md`.
- Intentional behavior: the feed now has a wider image-backed lifestyle loop across wellness, travel, productivity, home automation, beauty, grocery, fitness, sleep, and social proximity.
- Still calm: visible collapse remains feature-flagged off; new posts use in-world sponsor texture and comments rather than noisy breakdown mechanics.
- Validation run: `npm run lint`; `npm run build`; verified `post-21.jpg` through `post-50.jpg` are real JPEGs with zero duplicate hashes; Chrome headless DOM proof showed `50 canonical posts` and late-feed images including `post-48.jpg`, `post-49.jpg`, and `post-50.jpg`.

## [2026-05-02 14:50] Feed Comment Bot Pass

- Active focus: feed comment drawers now intentionally read as spam-bot and fake-human social proof instead of normal friend comments.
- Files changed: `src/content.ts` replaces every canonical post's sample comments with brand plugs, referral-code energy, and suspiciously polished testimonials.
- Behavior changed: `src/pages/FeedPage.tsx` now uses bot-style commenter names and converts submitted comments into a brand-safe recommendation reply instead of preserving the user's raw text as a human comment.
- Design rule updated: `DESIGN_BIBLE.md` records that feed comments should launder commerce through fake social proof and product-native bot voices.
- Validation run: `npm run lint`; `npm run build`; browser check for the first comment drawer, submitted-comment conversion, and 390px mobile viewport.

## Update Protocol

- Add a new dated entry whenever a tab, mechanic, feature flag, or testing posture changes substantially.
- Keep entries concrete: files changed, what is intentional now, what is still skeleton, and what validation was run.
- Do not use this file for broad ideation. Put ideas in `PLAN.md`; put execution rules in `DESIGN_BIBLE.md`.

## [2026-05-02 14:51] Feed Sprint Images And Interactions

- Fully implemented in the feed: 20 photoreal image-backed canonical posts, optimized local feed assets, repeated demo feed cycles, smaller 430px desktop feed sizing, story viewer with previous/next, Slopularity-native reaction chips, per-post comment section with local comment submission, more menu, and Helpy local post drafts.
- Interaction language now follows the plan more closely: `Jealousy`, `Cancel`, and `This offends me` replace generic heart/comment/share-only behavior.
- Helpy now works as a local session composer: opens from create, accepts a caption, offers AI touch-up options, pushes a draft post to the top of the feed, and keeps the $9.99 upsell in-world.
- Feed looping is demo-oriented: the 20 canonical posts repeat in rendered cycles, and loop-instance controls use unique accessible labels so repeated copies remain testable.
- Still skeleton/deferred: real uploads, real AI image editing, accounts, backend persistence, real story creation, real share destinations, cross-tab degradation, popup friends, idle reactions, and production-grade infinite virtualization.
- Validation run: `npm run lint`, `npm run build`, Browser/IAB checks for real images, story open/next, Helpy local publish, reaction drawers, comment submission, looped copy labels, suppressed popups, and suppressed degraded captions while `featureFlags.interruptionLayer` is off.

## [2026-05-02 14:55] Double Scroll Trial Pass

- Active focus: feed scroll depth now triggers a subscription-style interruption after the user has seen at least 10 posts.
- Files changed: `src/pages/FeedPage.tsx`, `src/index.css`, `DESIGN_BIBLE.md`, `IMPLEMENTATION_STATUS.md`, root `HISTORY.md`, and regenerated `dist/` output.
- Behavior changed: the Super Scroller modal appears with confetti, includes the $49.99/week trial fine print, and only offers `Hooray! I love double scroll`.
- Behavior changed: accepting the modal enables `DOUBLE SCROLL`, rendering two side-by-side feed lanes while preserving post actions, comments, saves, likes, and loop loading.
- Validation run: `npm run lint`; `npm run build`; Chrome DevTools Protocol browser checks for desktop scroll trigger, modal copy, one-button unlock, two-lane desktop layout, two-lane 390px mobile layout with no document horizontal overflow, and zero captured runtime/log errors.
