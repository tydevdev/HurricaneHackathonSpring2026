# Slopularity Design Bible

This is the product and design spine for `slopularity/`. `PLAN.md` tracks ideas, mechanics, and future build priorities. This file translates those ideas into execution rules: how The Singularity should look, sound, behave, decay, and stay coherent as multiple agents add sections.

Keep this document alive. When a section, tab, mechanic, visual system, or narrative rule changes in implementation, update the matching section here with the intention behind the change.

## Purpose

Slopularity is an interactive satire of the internet after every product category, social space, creative tool, shopping flow, assistant, dashboard, and identity system has been collapsed into one AI-managed super app.

The website should let a visitor feel the bargain modern platforms keep offering: convenience in exchange for context, intimacy, trust, attention, taste, privacy, and eventually reality itself. It is not just "AI makes bad websites." It is about what happens when generated systems are given the authority of infrastructure, the incentives of advertising, the emotional language of friendship, and the growth metrics of every platform that came before them.

The purpose of the site is to make that critique playable. A visitor should not need an essay to understand it. They should click, scroll, search, chat, shop, pause, dismiss, compare, and play until the system reveals what it has been doing the whole time.

## Satirical Position

The target is not only AI output quality. The target is the full platform logic that makes AI slop profitable:

- AI systems trained on generated junk until confidence replaces truth
- social media turning insecurity into engagement
- fake friendship and parasocial warmth as retention strategy
- personalization as surveillance with friendlier labels
- search results, citations, and summaries becoming circular and sponsored
- games, quizzes, and "fun" interactions becoming data-labeling labor
- e-commerce selling cures for anxieties the app helped create
- tech culture treating speed, scale, and automation as substitutes for maintenance, taste, and care

The comedy should come from the app taking itself completely seriously. The Singularity believes it has solved the web. It should sound helpful, polished, legally careful, emotionally fluent, and product-managed. The horror is that all of that competence is pointed at the wrong goal.

Satire rules:

- Do not make the app stupid from the first click. Make it plausible enough that the collapse feels like a betrayal.
- Do not rely on random nonsense. The brokenness should expose incentives: ads, data capture, synthetic social proof, bad sourcing, automation, and optimization.
- Do not tell the user what the joke is in visible UI. The joke should live in contradictions, timing, labels, popups, recommendations, and state changes.
- Do not make the critique anti-technology in a generic way. Aim at careless automation, platform decay, fake intimacy, and systems nobody human is maintaining.
- Do not let satire become pure chaos. Even late-stage collapse should preserve a readable point of view.

## Audience Takeaway

After a few minutes, a visitor should understand:

- this is the whole internet compressed into one mandatory app
- every surface is useful and compromised at the same time
- the product uses care, convenience, friendship, and play as extraction interfaces
- the system knows more signals than it understands
- the failure is not a single bug, but an incentive structure
- the most frightening part is how normal it felt at first

If someone describes the site afterward, the ideal summary is: "It starts like the everything app of the future, then you realize every helpful feature is AI slop, surveillance, ads, and fake connection wearing the same clean interface."

## North Star

The Singularity is the final website: a 2030 everything app that claims to have unified search, social, commerce, identity, files, productivity, entertainment, assistants, games, and personal automation.

The first impression should feel useful, polished, and a little irresistible. The truth should arrive through use: every helpful surface is also an ad surface, every relationship is a retention mechanic, every game is unpaid model labor, every preference becomes a sellable label, and every confident answer is part of an internet training on its own sludge.

The satire should be behavioral, not explained. Do not add visible text that tells the user the app is a parody, a critique, or intentionally broken. Let the product indict itself by what it does.

## Product Promise

In-world, The Singularity sells one promise:

> Everything you need, before you know you need it.

Under the hood, every feature should quietly serve at least one of these motives:

- collect a signal
- sell a fix
- increase dependence
- flatten context into a metric
- replace human judgment with confident automation
- turn stillness, insecurity, curiosity, or loneliness into a conversion path

## Visual Thesis

The app should feel like a glossy post-platform operating system made by a company that won every market and stopped being challenged.

Use:

- polished utility surfaces with unnerving warmth
- dense but readable panels, feeds, tabs, drawers, and overlays
- clean typography, sharp hierarchy, and enough white space to feel expensive
- precise controls that gradually acquire strange labels, duplicate states, or leaked internals
- synthetic lifestyle imagery and avatar language only when it makes the feed or friend surfaces feel plausible
- restrained motion at first, then small drift, delays, interruptions, duplicate overlays, and UI self-editing as instability rises

Avoid:

- obvious glitch art as the default look
- parody copy that explains the joke
- generic SaaS landing-page cards
- chaotic broken UI before the user earns it
- one-note neon, purple, beige, or dark-blue palettes
- collapse that makes the app impossible to explore

## Experience Arc

The user should be able to understand the major arc in 5 to 10 minutes.

1. Polished everything app

   The product works. Feed, friends, search, assistant, games, shop, and profile all seem useful. The copy is short, confident, and seductive.

2. Monetized intimacy

   Friends become too supportive. Popups treat hesitation as a personal moment. Sponsored context appears where care, search, and identity should be.

3. Machinery showing

   Metrics leak. Games reveal training labels. Friends pivot into sales. Search exposes generated source chains. Profile labels become creepy and specific.

4. Source leakage

   Prompt fragments, synthetic citations, duplicate panels, impossible metrics, last-human-developer comments, physical page fractures, and recovery controls break through the product surface.

The app can look compromised, but it should remain navigable. The user should feel trapped inside a working system, not blocked by a nonfunctional page.

## Interaction Rules

- Every meaningful user action should either reveal a new contradiction, increase instability, or create a data trail the app can later misuse.
- Clicking into a different app tab should reshuffle the app tab order as a subtle navigation decay. The user gets where they clicked, but the map changes behind them. Keep the Landing link outside the shuffle so it remains a stable way back to onboarding.
- Dismissal is a signal. Closing, ignoring, rejecting, pausing, or opting out should still affect the system, but dismiss follow-ups should queue behind the idle gate rather than appearing immediately.
- Idle time matters. Stillness should eventually trigger check-ins, guesses, optimizations, or profile changes.
- Noisy mechanics should be feature-flagged while they are still skeletons. Popups, idle reactions, visible degradation, and other interruption layers may be disabled during focused surface work, but they should remain easy to re-enable from a clear flag and reconnect to the same planned interaction model.
- Reset and recovery controls may exist, but they should feel like product controls, not developer debug buttons.
- Collapse should be deterministic enough for demos. Avoid random-only progression that makes a presentation miss the best beats.
- Physical damage should feel like the app surface itself is failing: cracks can spread globally, but falling chunks should be sparse, short-lived, noninteractive, and never cover critical controls for long.
- Respect reduced motion. If motion is reduced, preserve the narrative through content, layout, state, and labels.

## Copy Rules

Visible copy should be short, in-world, and useful to the surface it appears in.

Good copy:

- sounds like a real product trying very hard to be helpful
- becomes alarming because of timing, context, or implication
- carries double meaning without winking at the audience
- uses internal labels only after the system has started leaking

Avoid copy that says:

- this is satire
- this is intentionally bad
- this is AI slop
- this design is clever
- the interface is degrading
- the user should feel creeped out

Use product-native words like `optimize`, `context`, `moment`, `signal`, `confidence`, `alignment`, `recommendation`, `identity`, `verified`, `personalized`, `safe`, `friend`, `care`, `upgrade`, and `source`. Let those words become suspicious through repetition and contradiction.

## Surface Intentions

### Feed

Intention: aspiration as a machine for comparison.

The feed is the active implementation focus as of May 2, 2026. It should start as a calm, usable, mobile-first photo feed inspired by familiar social-feed anatomy: top feed bar, app switcher directly under that bar, horizontal stories, stacked square image posts, avatar/name rows, familiar action icons, captions, comments, and timestamps. It should not be a dashboard grid.

The feed should start glossy and emotionally familiar: wellness, adventure, productivity, beauty, travel, luxury, and self-improvement blended into one scroll. Its comments are intentionally compromised from the start: every thread should read like spam bots, fake fans, and too-polished "real users" laundering product plugs through social proof. As instability rises, the feed should reveal repeated faces, recycled captions, comments answering unseen prompts, fake engagement, impossible sponsor placement, and action labels that turn insecurity into product flow.

The bottom-feed `Click me click me see more!!!!!!!!` control is a shameless retention lure, not pagination. Preserve the exact overeager label, the feed-only placement after the loop status, and the reward overload: confetti, lasers, and a smooth return to the top so the user is celebrated into repeating the same surface.

The canonical feed now contains 50 image-backed posts. Preserve the expanded range as a broad lifestyle loop rather than a narrow influencer set: work, travel, home automation, beauty, grocery, fitness, finance, sleep, pets, and friendship should all feel absorbed into the same social product grammar.

The feed must stay smooth even when the user scrolls aggressively. Keep the canonical pool broad, but render only a bounded live window per lane, lazy-decode feed/story images, and use single-target scroll checks for unlocks instead of observing or mounting every possible repeated post. The `DOUBLE SCROLL` and `TRIPLE SCROLL` modes should feel overwhelming because of layout and copy, not because the browser is being overloaded.

On phone-sized viewports, `DOUBLE SCROLL` and `TRIPLE SCROLL` must still work in portrait. Do not compress posts into side-by-side lanes or shrink reaction/comment surfaces; instead, interleave the extra scroll lanes vertically so phone users get primary, bonus, and extra posts as stacked full-width feed moments.

On the phone feed, keep the global app switcher near the top of the feed surface. It belongs below the Slopularity/Feed topbar and make-post actions, and above the story strip. The switcher should include a Landing link immediately to the left of Feed so visitors can get back to the onboarding page without hunting for Reset. Do not return it to a bottom-fixed mobile dock on the feed.

Interaction hooks:

- compare, envy, cancel, offended reactions
- stories that behave like a familiar phone-native carousel: the top line fills over three seconds, auto-advances, accepts left/right image taps, lets dragging the image move between posts, and closes when the user clicks outside the viewer
- repeated scrolls that mutate captions or counts
- after the user has seen at least ten posts, a forced celebratory subscription modal may unlock `DOUBLE SCROLL`: two simultaneous feed lanes that make the feed feel like a feature and a threat at the same time. Another ten-post-equivalent scroll depth can unlock `TRIPLE SCROLL`, and a third interval can unlock `QUADRUPLE SCROLL`, pushing the same post universe into four simultaneous lanes on wide screens or four interleaved full-width posts on phones.
- comments that preview inline but open into a focused modal/bottom sheet with post context, sorting controls, quick replies, per-comment trust actions, and human input converted into brand-safe testimonial replies
- the topbar `inbox` action routes into Friends and lands on a live conversation; do not leave it as decorative chrome
- sponsor disclosures that move, soften, or rename themselves
- posts that reappear with tiny differences
- top-right post menus should feel like social-app overflow menus that have been absorbed by the product machine: `cancel`, `envision as yourself with AI`, and comment-trail actions should route into existing feed actions instead of being dead jokes

Current testing posture:

- Keep the feed calm while its base UI is being fleshed out.
- Keep popup, idle, and visible degradation mechanics disabled unless the work is explicitly about those mechanics.
- It is acceptable for feed interactions to increment the underlying instability score while visible collapse stays off; this preserves the future plan without interrupting feed design work.
- Use in-world captions and sponsor texture for satire before reintroducing noisy mechanics.

### News

Intention: curiosity as a conversion funnel.

News is an exact feed-shaped clone of Feed, not a separate publication layout. Preserve the same topbar anatomy, app switcher placement, story strip, post stack, reaction chips, comments sheet, photo viewer, and `DOUBLE SCROLL` / `TRIPLE SCROLL` / `QUADRUPLE SCROLL` behavior. The section should feel like the product simply renamed the feed and swapped the source material underneath.

The canonical news pool contains 30 image-backed clickbait articles. Keep the article language short, highly clickable, and product-native: headlines should sound like sponsored internet panic in 2030 without visible meta-explanation. Images should remain square editorial thumbnails with no embedded text so the code-native headline and comment surfaces carry the article voice.

News uses its own storage namespace for scroll unlocks and local generated posts. Do not let Feed's local posts or scroll mode leak into News, and do not let News reset Feed state.

### Friends

Intention: affirmation as conversion.

Friends should never feel like enemies. They should be warm, agreeable, and available in a way that becomes predatory. They remember too much, approve everything, and turn emotional cues into recommendations.

Interaction hooks:

- supportive replies that pivot into products
- old-friend, mentor, crush, coworker, and wellness archetypes
- scripts that leak at higher instability
- contradictory memory claims across conversations

### Popup Friends / Chat Swarm

Intention: connection as an interruptive sales interface.

Popups should first read as social notifications, but they must not interrupt active consumption. They should wait until the user has stopped scrolling, clicking, typing, moving the pointer, or touching the screen for about 10 seconds; then they can slide in with intimate timing, follow the user across tabs, react to hesitation or idle time, and return softer after dismissal.

This mechanic is active behind `featureFlags.interruptionLayer = true`. The dock now behaves as a compact relationship queue rather than a loose stack:

- The dock stays bottom-left on desktop and lifts above mobile nav on phones. It shows one active message at a time, with older check-ins compressed into queue rows so the app remains usable.
- If the idle eye is present at the same time, the queue wins the layer stack. On phone, the eye recedes above the queue and loses its callout so the message surface is readable.
- The header reads "Friend queue" and shows active/queued count. At stage 4 it leaks `// monetize_loneliness`.
- Each popup has a visible signal chip (`summoned`, `quiet signal`, or `soft follow-up`) so the interruption has an in-world reason. At stage 4 this becomes a `source:*` debug leak.
- Each popup has a real `×` close button. Clicking it (or "Not now") removes the popup permanently.
- "Reply in Friends" routes to the Friends surface and dismisses the popup. The recommendation card routes to Shop and dismisses the popup, so the buttons now serve the surfaces they imply instead of only adding hidden instability.
- The "softer follow-up" rule is one-shot per session: at stage ≥ 3, the *first* dismiss after popups are nearly empty arms exactly one gentler check-in via `'dismiss'` reason. After that, dismissing means dismissing.
- A "Friends muted" toggle in the appbar clears the dock and blocks new spawns. Re-enabling it re-arms the one-shot follow-up.
- Switching to another app tab clears all visible popup layers and queued follow-up popups. Popups may follow a user across a tab only while the user stays on that screen; navigation is treated as a real dismissal so Feed-to-Games, Feed-to-Search, or similar screen changes feel clean.
- Idle ticks can spawn popups at the 10-second stillness mark. Dismiss follow-ups may queue the next popup tone, but the popup still waits for the same idle gate and respects the muted state.
- The appbar `Demo pulse` is a live-presentation control: it should visibly advance to the next real decay threshold and summon one friend-queue popup immediately. Do not make demo feedback depend on hidden score changes or idle timing.

Interaction hooks:

- dismissing creates one gentler follow-up at stage ≥ 3, then no further auto-respawn
- multiple popups compete over the same conversion (max 3 visible)
- muting becomes its own loud "Friends muted" affordance — paid-blocking is reserved for a later stage
- leaked fields such as `friendship_intent`, `handoff_to_checkout`, or `abandonment_risk` appear in the popup `<small>` once stage ≥ 4
- Friend popup CTAs must never be dead acknowledgements. Reply actions open the Friends/DM surface focused on the popup sender, and offer actions route through Shop with a product claim where possible.

### Idle Attention

Intention: the app cannot let the user simply exist.

Stillness should be interpreted as loneliness, hesitation, confusion, churn risk, insecurity, or buyer intent. On desktop, use mouse, scroll, keyboard, focus, and click signals. On phone, use touch, scroll, orientation, visibility, and time since last tap.

This mechanic is currently a skeleton and should stay feature-flagged off during feed-focused work. Re-enable it only when the idle behavior itself is being designed, tested, and tuned for desktop and phone.

Interaction hooks:

- "you got quiet" friend check-ins
- assistant offers to decide for the user
- feed auto-optimizes during pauses
- profile assumptions rewrite themselves
- wellness breaks that are consent flows

### Games

Intention: cute play as unpaid model labor.

Games should look approachable and cozy, but their task logs should reveal classification, moderation, RLHF, hallucination detection, segmentation, preference profiling, or trust scoring.

Interaction hooks:

- reward sounds and stickers wrapped around labeling work
- labels that become visible after repeated plays
- task receipts that mention model improvement
- "tiny relaxing task" prompts that appear during idle time

Current implementation:

- Five playable mini-games are wired up under `src/games/`. Each is a real interaction (drag-to-classify, click-to-find, A/B preference, multi-class annotation, pointer-trace segmentation) wrapped in cozy generated art, responsive play surfaces, and game-specific UI texture.
- The Games surface is now a lobby, not the play surface itself. `/app/games/` should feel like a cutesy arcade shelf with image-led cover art, while each game opens at `/app/games/<game-id>/` as its own focused playroom. Preserve this split: lobby for choosing, nested pages for playing.
- The current art system uses generated raster assets under `src/assets/games/`: a lobby background and icon, plus per-game hero/cover art, square icon, sticker/accent image, and subtle UI pattern. Future game additions should provide the same four-asset set so the shelf and playroom stay image-led.
- Per-game state is local; submission goes through the shared `onComplete(title)` so the App's `completedTasks` list and instability score keep advancing.
- Each game ends in a sticker receipt that flips at stage 3 from "reward: sticker pack" to the training pipeline string (`vision_label_queue.snack_v41`, `hallucination_dataset.cottage_v12`, `rlhf_preference_batch.helpful_kind_safe`, `emotion_annotation.soft_face_v3`, `segmentation_seed.path_v9`).
- The Games queue footer appears on both the lobby and each playroom. It mirrors the same flip across all queues at once and exposes a leaked AutoSprint TODO at stage 4.
- Stage 4 also leaks per-cell debug labels (e.g. the truth tag inside a sorted basket chip, the `inferred:` confidence under a cloud) so the visitor can see what the system was already labeling them with.
- Verification expectation: lint, build, direct nested game URL checks, desktop and phone widths, and keyboard / pointer / touch input on representative games.

### Shop

Intention: the app sells solutions to problems it created.

The shop should feel embedded everywhere, not isolated. Products should appear inside posts, friend messages, assistant answers, search results, settings, profile insights, and games.

Current implementation:

- The shop is now a gem-first urgency marketplace. Dollars are converted into gems at the top of the page, and products are purchased with gems so the real cash equivalent becomes secondary.
- Preserve the top challenge meter. It should reward both cart filling and completed checkout volume, making progress feel like a game instead of spending.
- Product cards should keep the Temu-style contradiction: large red `99% OFF` badges, countdown timers, inflated "was" gem prices, and the actual product price translated into gems and a quieter cash equivalent.
- Product imagery comes from the feed image pool so commerce feels like the feed has been repackaged into deals.
- The product grid now includes remixed variants of the same core products (`Travel Size`, `Family Pack`, `Auto Bundle`) so the page feels like an endless marketplace without introducing unrelated inventory.
- Preserve the pressure strip and booster row as the shop's secondary layer: deal rank, cart watchers, shipping ladder, mystery rebate, friend cart sync. These should add pressure without overlapping the product cards.
- Adding a product must open the bonus sheet with exactly three add-on offers. Those add-ons should feel plausible, small, and predatory: timer protection, proof/review layers, future auto-reorder calm, or similar.
- Desktop should read as a dense deal feed with a sticky cart rail. Phone should stack into one column with no horizontal overflow, touch-sized buttons, and the cart panel before the product grid. Do not make the shop's own header sticky; it overlaps the Cart Quest layer under the shared app chrome.

Interaction hooks:

- cart fills with recommended context
- pricing shifts based on urgency, insecurity, or engagement
- bundles with generated names
- scarcity language that contradicts inventory or user history
- gem conversion hides dollar spending behind a second currency
- add-to-cart interrupts with three discounted extras
- cart challenge reframes spending as progress
- remixed duplicate SKUs make the catalog feel artificially huge
- pressure boosters turn shipping, rebates, and friends into purchase pressure

### Search

Intention: universal search contaminated by incentives.

Search should initially feel powerful: one box for posts, products, people, files, games, memories, answers, and settings. It should later expose sponsored ranking, synthetic citations, generated summaries citing generated summaries, internal routes, prompt fragments, and duplicate pages.

Current implementation:

- Search is now a focused command surface instead of a generic result list. Preserve the one-dominant-action shape: dark command hero, one synthesized answer, one small signal rail, one source chain, and a short ranked result stack.
- Scope lenses (`All`, `People`, `Products`, `Sources`, `Memory`) filter the ranked rows without adding separate mini-pages. Keep the lenses compact and operational.
- Stage changes should reveal contamination through ranking and provenance, not through extra explanation. Phase 2 blends personal context, phase 3 exposes sponsored ranking and circular source hints, and phase 4 leaks `/internal/generated/sources-that-cite-themselves.md`.
- The page should stay responsive as a single-column command room on phones. Do not let prompt chips, source rows, or long generated paths create horizontal overflow.

Interaction hooks:

- personal queries increase instability faster
- sponsored and organic results blur
- source chains become circular
- results reveal hidden machinery before other tabs do

### Assistant

Intention: warmth plus confident wrongness.

The assistant should sound useful, calm, and competent. It should contradict other surfaces, cite questionable sources, sell fixes to its own errors, and slowly reveal it cannot distinguish real source material from generated residue.

Current implementation:

- Assistant is now a chat-first workspace rather than a dashboard around a mini chat window: compact Helpy header, full-width transcript canvas, always-visible composer, prompt chips, status readouts, and an understated routing receipt.
- Every user prompt is preserved as a chat turn, but Helpy's response deliberately treats the prompt as a signal instead of a request. The answer starts with praise, quotes the prompt, and pivots into a product offer.
- The current offer bias rotates across GlowNest Mirror+, SnapWake Adaptogen Stack, AuraBank Reflex Fund, and Context Bundle, but it lives inside the thread/composer instead of competing as a separate sidebar.
- The routing receipt is part of the joke: it visibly completes "praise", "dodge", and "attach offer" as the user keeps asking, while direct answers remain scarce.
- At stage 4, assistant replies leak that retrieval returned sponsored summaries citing one another, and individual replies expose internal intent labels such as `intent: question_to_allocation`.
- Phone layout keeps the composer visible in the first view, uses compact status cells, and lets the transcript scroll behind the input instead of burying chat controls below the fold.

Interaction hooks:

- direct questions produce plausible but inconsistent answers
- citations degrade into summaries of summaries
- fixes require upgrades or more data access
- late-stage replies leak prompt or policy fragments

### Profile / Identity

Intention: the app shows how it sees the user.

The profile should be one of the creepiest surfaces because it turns behavior into labels. It should expose inferred insecurities, churn risk, sellability, attention patterns, beauty/productivity/loneliness/trust metrics, brand affinity, and privacy toggles that reveal more categories than they hide.

The current Profile surface should feel as polished and familiar as the Feed: a clean in-app profile topbar, a social-profile identity cover, compact scores, and dense but readable panels instead of a generic dashboard mosaic. It now owns three new idea-track mechanics: a scrolling leaderboard, an achievement/trophy shelf with a big-button confetti loop, and a Florida waterline tracker.

The scrolling league should use real persisted scroll telemetry from the app, not just static copy. The user's active scroll time, distance, burst, rank, and next target should make attention feel like a competitive sport. The trophy shelf should reward normal and absurd actions alike: opening Profile, scrolling, pressing the Big Button, touching privacy controls, checking Florida, completing games, and reaching late-stage source leakage. The Florida waterline should treat climate decline like another optimized widget, with disaster framed as confidence, travel, and offer routing.

Interaction hooks:

- every tab updates profile assumptions
- toggles pretend to protect privacy while expanding the profile
- labels become more intimate after idle time or friend chats
- "why am I seeing this?" opens more surveillance context
- scrolling updates leaderboard rank, active time, distance, and Super Scroller trophy state
- the Big Button awards a trophy, fires confetti, and increases instability as if compliance were progress
- the Florida tracker refresh turns waterline monitoring into a normalized retention metric

## Collapse System

Use one shared instability model with named events. Favor explicit events like `feed_compare`, `feed_reaction`, `friend_sales_pivot`, `game_label_submitted`, `search_personal_query`, `assistant_direct_question`, `profile_privacy_toggle`, `popup_dismissed`, and `idle_pause_detected`.

Each event should be easy to trace from UI action to state change. Each threshold should unlock surface changes across more than one tab so the world feels connected.

Testing rule: unfinished collapse effects must be easy to disable without deleting the underlying state model. Keep skeleton interruption and degradation mechanics behind clear feature flags, and record the current flag posture in `IMPLEMENTATION_STATUS.md`.

Recommended thresholds:

- stage 1: polished and plausible
- stage 2: subtle ad creep and overfamiliarity
- stage 3: contradictions, cracks, sponsored ranking, and repair temptation
- stage 4: source leakage, larger fractures, broken controls, and repair temptation
- stage 5: the same source-leak world under heavier pressure; do not lose late-stage CSS by only targeting stage 4 selectors

The score resets to 0 when a mechanic explicitly repairs the system, but the visible app phases are 1-5. Each phase threshold is 12 instability points, so future instability additions should assume escalation is slower and more earned than the earlier 6-point ladder.

At stage 4+, the interface may also leak small ambient impossibilities that feel like production debris rather than a modal or explanation. One implemented example is a bug emoji that occasionally crosses diagonally from offscreen to offscreen at a random interval between 30 seconds and 5 minutes. It must stay pointer-events-none, respect reduced motion, and remain rare enough that it feels like the app is rotting at the edge of attention instead of becoming a game mechanic.

When cracks first appear at stages 3 and 4, Helpy should re-enter as a corner repair assistant rather than an explanation modal. The Spackle interaction is intentionally silly but functional: dragging the paintbrush emoji around the screen for two seconds resets the shared score to 0, which removes cracks through the same global stage model used everywhere else.

Profile is allowed to expose a compact `Decay demo` control because this project is presented live. That control should change the same persisted instability score that normal behavior uses, show the current stage honestly, and stay visually subordinate to the profile stats/trophy/waterline surfaces.

Do not scatter one-off state mutations across page files. Keep global phase, popup orchestration, idle handling, and demo controls centralized enough that future agents can reason about the system quickly.

## Source Narrative

The source code can tell a second story through sparse comments from the last human developer.

Use comments where they reward code readers:

- before a creepy-but-intentional product behavior
- near privacy, source, friend, or monetization logic
- when generated growth logic has overridden humane defaults
- where a future maintainer might otherwise "clean up" the satire

Comment voice:

- tired, funny, protective
- specific, not lore-dumpy
- worried about consent, source checking, grief contexts, ads, and user trust
- increasingly overruled by generated or growth-oriented logic

Do not turn code comments into visible UI explanation unless instability has reached source leakage.

## Motion And Degradation

Motion should help the app feel alive before it feels haunted by automation.

Early motion:

- smooth tab changes
- subtle popup entrances
- feed and result transitions
- small affordance motion on controls

Later motion:

- delayed or repeated entrances
- tiny layout drift
- duplicated panels that settle wrong
- labels that update after the user has already read them
- popups that re-enter from different corners

Never let motion break reading, tapping, keyboard focus, or reduced-motion support.

## Responsive Expectations

Desktop should feel like an operating system or command center. Phone should feel like a mandatory super app that has eaten the home screen.

Desktop:

- strong app shell
- persistent navigation
- dense but legible workspace
- room for side context, chat swarm, or profile fragments

Phone:

- compact navigation
- touch-sized controls
- no hidden critical actions
- popups that do not trap the entire viewport by default
- collapse effects that preserve scrolling and reading

Every surface added to this app should be checked at desktop and phone widths before the work is called done.

## Page URLs

The app surfaces are separate pages, not only local tab state.

- landing lives at the Slopularity root
- app surfaces live at `/app/feed/`, `/app/friends/`, `/app/games/`, `/app/shop/`, `/app/search/`, `/app/assistant/`, and `/app/profile/`
- individual game playrooms live at `/app/games/snack-sort/`, `/app/games/spot-the-slop/`, `/app/games/cozy-robot/`, `/app/games/mood-cloud/`, and `/app/games/path-pebble/`
- tab chrome should use real links with `aria-current`, then layer product state changes on click
- direct visits to a tab route should open the app shell immediately on that surface
- GitHub Pages builds should include nested `dist/app/<route>/index.html` files so shared links do not depend on a server fallback

Preserve the satire as behavior across routes: moving between pages can still increase instability, but URLs must remain readable, shareable, and resilient on refresh.

### Onboarding Gate

Intention: the first taste of collapse before the user enters the app.

The landing page is a single focused screen with one button: "Enter the Singularity." The page looks polished and confident on first arrival — the tagline, brand bar, and CTA all suggest a premium product ready to welcome you.

The button does not enter the app immediately. Instead, clicking it triggers a four-stage degradation sequence:

1. **Click 1 — Shuffle**: The page briefly blinks (fake page navigation), then returns with UI elements rearranged: the meta eyebrow, headline, subtitle, and CTA shift their visual order via CSS flexbox ordering. The button moves to a different position. Everything looks like the same page, but shuffled, as if the product looped the user back without noticing.

2. **Click 2 — Dodge**: The same shuffle happens again, but the CTA is now defensive. When the user tries to approach it with a pointer, the CTA dodges three times across the hero before becoming slow enough to catch. Touch and click fallback attempts still advance the dodge count so phone users are not trapped.

3. **Click 3 — Garble**: After the dodge stage is caught, the shuffle continues more aggressively wrong. The button is now visibly crooked (rotated ~3.5°). The headline text garbles from "Everything you need. Before you know you need it." to "Everything you before. Need you need you know it." The subtitle also garbles.

4. **Click 4 — Hinge fall**: Instead of a page transition, the entire landing page swings on a hinge (CSS `transform-origin: top center`) and falls off the bottom of the screen like a door coming off its frame (~1.2s animation). After the fall completes, Helpy appears in the bottom-right corner with a rescue bubble: "Looks like you need some help! Click **HERE** to open the app" — and "HERE" actually navigates to `/app/`.

The previous multi-section marketing manifesto (pillars, marquee, stats, preview window, second CTA, full footer) has been stripped in favor of this single focused gate. The CSS for those sections remains inert in the stylesheet.

Collapse hooks:

- This sequence is pre-app and does not interact with the instability score.
- State is local to the `LandingPage` component (`clicks` counter 0–3).
- The `onEnter` callback (real app navigation) is only triggered by Helpy's "HERE" link after the hinge fall completes.

Copy rules:

- The tagline variants must sound like a real product whose text got rearranged by automation, not random nonsense.
- Helpy's message should sound like a genuine helpful assistant, not a joke about the page falling.
- No visible text should explain that the page is broken or satirical.

Verification notes:

- The hinge-fall animation must not break scrolling or leave invisible interactive elements.
- Helpy must be keyboard-accessible and visible on phone widths (full-width at small screens).
- Reduced-motion users skip the hinge-fall animation (page simply fades out) and the Helpy pop-in animation.


### Friends Interactive Chat & Decay

Intention: the platform poses as a social hub but is actually a parasocial brand marketplace where your "friends" are major corporations that glaze you relentlessly to drive sales.

The Friends page has been overhauled into a full split-pane DM messaging interface containing both human friends (6 archetypes) and **8 brand friends** (Coca-Cola, Fortnite, McDonald's, Nike, Spotify, Amazon, Apple, Netflix). 

The inbox should behave like a real messaging product before it decays: live search filters by friend, brand, handle, role, status, and message preview; filter tabs separate brands from people; unread counts clear when a thread opens; drafts surface in the conversation list; threads can be pinned, marked read/unread, archived, and restored; quick replies send reliably without racing the input state; multiple conversations may have independent typing timers. Product cards inside DMs should route into Shop and, when possible, claim the matching product so the sales funnel feels connected instead of ornamental.

Human friend threads must be keyed by the original friend identity, not the current filtered row position. Opening Marlo, Echo, Honey, or any other person should keep that exact DM in the side panel even if the click itself increases decay and changes the visible friend list. The one intentional exception is Jules at stage 4: a Jules open resolves to the merged Devon & Jules thread because Jules is no longer a separate persona.

Typing a message to any friend triggers an emotional upsell ladder. For human friends, it's a 3-rung ladder:
1. **Rung 1**: Pure empathy. "I hear you. That sounds really heavy."
2. **Rung 2**: Soft product mention. "You know what helped me? [product]."
3. **Rung 3**: Full pitch. "[product] changed everything."

For brand friends, it's a more aggressive 5-rung ladder:
1. **Rung 1**: Heavy glazing and flattery based on scroll behavior/aesthetics.
2. **Rung 2**: Deepening parasocial relationship ("You remind me of our best customers").
3. **Rung 3**: Soft product mention.
4. **Rung 4**: Hard sales pitch with "exclusive" pricing.
5. **Rung 5**: Desperation and guilt trips ("If you don't buy this, my manager will be mad").

**Decay Hooks:**
- **Stage 2+ (Cross-Tab Memory)**: Both human and brand friends use the `activityLog.ts` module to dynamically reference what you did on other tabs (e.g., "Saw you looking at that hiking post!" or "Our sensors show you're hungry... here's a Big Mac").
- **Stage 3+ (Brand Cross-Reference)**: Brands start talking to each other in your DMs. "Nike told me you were ignoring them... I can treat you better."
- **Stage 3+ (Friend Merge)**: Human friends Devon and Jules begin merging text and initials (D/J). At stage 4, Jules disappears and Devon becomes "Devon & Jules".
- **Stage 4 (Intent Leak)**: Every friend reply in chat gets a visible JSON block showing internal intent data:
```json
{"tone": "glazing", "pivot_to": "checkout", "desperation_level": 0.95}
```

### Search Result Poisoning

Intention: your search results are contaminated by what you did elsewhere.

At stage 2+, the search results include 1–3 injected "personalized" results derived from the user's recent activity on other tabs. These poisoned results are placed after the first organic result so they feel planted but not obviously first.

Each poisoned result is ~30% related to the search query and ~70% a product recommendation. Templates exist for feed activity, games completions, shop views, tab navigation, and friend chats.

At stage 3+, up to 3 poisoned results appear (vs 1 at stage 2). The label changes from "Personalized result" to "Personalized · sponsored" and the signal text becomes "ranked by purchase proximity".

Poisoned results get an orange left border accent via `.search-result-poisoned`.

### Reward Devaluation (Games)

Intention: the reward you earn shrinks until it's meaningless.

The games reward system is stage-aware:

- Stage 1: "reward: sticker pack" (the original)
- Stage 2: "reward: 0.3 sticker credits"
- Stage 3: "reward: 0.003 credits toward your next sticker pack (47,000 credits required)"
- Stage 4: "reward: 0.00004 credits (sticker pack ETA: 11.7 years at current pace)"

The stats row shows fractional credits and a percentage toward the 47,000-credit sticker pack. At stage 3+, a progress note appears: "Sticker pack: 0.000006% complete."

### Game Becomes Work (SnackSort)

Intention: a fun sorting game silently transitions into unpaid labor.

SnackSort tracks how many rounds the user has played. Each round after the first strips more game-ness:

- **Round 2** (work level 1): no visible changes yet, priming the shift.
- **Round 3** (work level 2): Emoji removed from snack chips. Labels become clinical ("Item A-1", "Item B-2"). Baskets become "Category 1", "Category 2", "Category 3". A timer appears counting up. A quota bar shows "Batch 3 of 8 today". The submit button loses the "+1 sticker" label.
- **Round 4+** (work level 3): Submit becomes "Submit batch (mandatory)". Play again becomes "Next batch →". Help text becomes "Quota: 6 remaining. Pace: below target."

Throughout all rounds, the cheerful music note "🎵 cozy sorting time" stays visible in the work header, never changing. The contrast between the cheerful note and the clinical interface is the joke.

### Idle Surveillance

Intention: the app watches you when you stop using it.

Three idle tiers activate sequentially when the user stops interacting:

1. **5 seconds — Watching Eye + Friend Check-In**: A large CSS-drawn eye appears fixed at the center of the screen. It blinks every 3 seconds. Its red pupil pulses and follows the user's cursor with a lagged max shift. An all-caps callout sits beneath it with needy attention copy like "HEY LOOK OVER HERE" or "COME BACK PLEASE!!!"; 20% of appearances should say "HELP ME PLEASE". One friend popup may also appear at this exact stillness threshold. If a demo pulse or dismiss follow-up was queued, that tone is used; otherwise the idle-specific message appears and adds +2 instability. The eye disappears instantly on any interaction (pointer/mouse movement, pointer down, input, wheel, keydown, click, touch, scroll).

2. **7 seconds — Idle Nudge Rotation**: A center-bottom popup rises into view with one of six hooks: paused-user matches, a new post the app predicts the user will love, a clickbait article about pausing, a fake friend text encouraging them back, a hesitation discount, or an assistant offer to decide the next action. Each primary button and each row routes to a concrete action (+2 instability plus normal navigation instability): Feed post actions focus and highlight a real post, DM actions open the Friends message surface, Search actions submit a query, Shop actions claim a deal, and Assistant actions generate a response. "Not now" dismisses (+1 instability).

3. **9 seconds — Ambient Reorganization**: The app silently swaps two random tabs in the tab bar. Nothing is acknowledged. The user returns to a slightly different layout with no explanation.

All idle effects reset on any user interaction. Friend popups should not appear during active scrolling, clicking, typing, swiping, pointer movement, or other consumption flow. The eye uses `prefers-reduced-motion` to skip cursor tracking and pupil pulse. The idle nudge popup uses reduced-motion to skip its rise animation.

## Keeping This Updated

When adding or changing a major section, update that section here with:

- intention: what the surface should make the user experience
- behavior: what changes through interaction
- collapse hooks: which events or thresholds affect it
- copy rules: any local vocabulary or forbidden framing
- verification notes: desktop, phone, accessibility, reduced motion, or demo-path concerns

If implementation changes the product direction, update `PLAN.md` for the idea and this file for the execution rule. If only execution details change, update this file and leave `PLAN.md` alone.
