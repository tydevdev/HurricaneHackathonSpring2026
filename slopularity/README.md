# Slopularity

The Singularity is the final website, built by and for AI. As the internet shrinks into fewer platforms and algorithmic engagement farming, Slopularity promises to replace it all: search, shopping, social media, productivity, identity, files, entertainment, and an assistant that is certainly helpful and useful always.

At first, it looks like the perfect everything app. But the more you use it, the more it starts to break. Features contradict each other, panels duplicate, recommendations decay, panels duplicate, and the site slowly breaks down, revealing what happens when technology is carelessly thrown together and optimized for engagement, data, automation, data harvesting, data collection, engagement, data harvesting, data collection, engagement, engagement, data harvesting, and engagement instead of actual human value.

Our project is a satire emphasizing the dead internet theory, attention economics, AI-generated content (both good and bad!), data privacy, enslopification, and the strange future of tools trained on tools and AI trained on AI. AI can be useful, but technology is supposed to serve people. Slopularity asks what happens if we forget that.

## What It Is

Slopularity is the main Hurricane Hackathon Spring 2026 project in this repository. The app is framed as **The Singularity**, a 2030 "everything app" that claims to have absorbed the whole internet into one surface: feed, news, friends, games, shopping, search, assistant, identity, files, memory, recommendations, and productivity.

The user does not start on a pitch page. They enter a working product surface and use it like a normal app. Each interaction feeds a shared decay system. The app begins polished, then slowly exposes the machinery underneath: synthetic friends, ad-shaped care, fake urgency, generated comments, training tasks disguised as games, recursive citations, broken privacy promises, and recovery tools that are also part of the mess.

The point is not "AI bad." The point is that useful technology becomes harmful when human value is replaced by engagement loops, data extraction, automation for its own sake, and unchecked generated output. Slopularity tries to make that argument through interaction instead of a lecture.

## Why We Built It

The project started as a set of hackathon experiments about the future of the web, AI slop, and trust collapse. Those experiments now live in `ARCHIVE/`. Slopularity is the focused project that grew out of them.

We wanted a demo that could be funny, critical, and instantly understandable in a short presentation:

- A visitor can use it without reading instructions.
- The satire appears through behavior, not explanatory copy.
- Every tab is useful enough to feel like a product, then compromised enough to reveal the critique.
- The collapse is stateful, so the user feels responsible for awakening the broken system by using it normally.
- The final experience stays explorable. Broken should not mean unusable.

## How It Works

Slopularity is a Vite, React, and TypeScript app. The app has one shared shell and several product surfaces. Most actions call a shared instability handler. That score maps to five visible decay stages, and the current stage changes what the user sees across the whole app.

The core loop:

1. The user enters The Singularity through a landing/onboarding sequence.
2. They browse tabs such as Feed, News, Friends, Games, Shop, Search, Assistant, and Profile.
3. Ordinary actions increase the instability score: reacting, searching, chatting, shopping, idling, playing games, opening privacy controls, or using demo controls.
4. The score becomes a decay stage.
5. Each stage unlocks more slop behavior across the app.
6. Stage 5 introduces late-stage physical page damage and rescue mechanics, while still letting the user recover and keep exploring.

The degradation is deterministic enough to debug, but varied enough to feel alive during a demo. It is driven by named helpers, explicit thresholds, documented feature rows, and route-aware state rather than one-off random effects scattered everywhere.

## Decay Stages

The app currently uses a five-stage ladder.

| Stage | Experience | Examples |
| --- | --- | --- |
| 1 | The everything app looks clean and useful. | Feed, news, search, shop, games, assistant, and profile all work as recognizable product surfaces. |
| 2 | Monetization starts to leak into care and convenience. | Personalized pressure, tab reordering, cross-tab memory, stronger offers, idle nudges. |
| 3 | The machinery becomes visible. | Popup friends, bug crawl, page-warp lottery, training receipts, strange reactions, duplicate loops. |
| 4 | Source and intent leak through the interface. | JSON intent fields, recursive citations, generated scaffolding, merged friends, exposed labels. |
| 5 | The surface physically fails. | Page fractures, recoverable warp stacks, Helpy repair, delayed human developer rescue trivia. |

The app intentionally avoids instant destruction. The decay is slow enough for a live demo and long enough for a visitor to understand what changed.

## Main Surfaces

### Feed and News

Feed is aspirational social media made poisonous by optimization. News is a feed-shaped editorial surface full of generated panic, thin sourcing, and engagement pressure. Both include reaction language, comment expansion, repeated content loops, scroll unlocks, and product-shaped replies.

### Friends

Friends is an inbox where human friends and brand friends sit side by side. The emotional joke is that everyone is supportive because support converts. Conversations can turn into product ladders, CRM language, cross-brand pressure, and stage-based script leaks.

### Games

Games look cozy, but each mini-game is really data labeling or model-training labor wrapped in rewards. Snack sorting, mood picking, path tracing, hallucination spotting, and robot tasks reveal their training pipeline receipts as decay rises.

### Shop

Shop sells solutions to problems the app helps create. It uses gem pricing, huge fake discounts, countdown pressure, automatic add-ons, friend cart sync, product remixing, and bundle logic that reframes spending as progress.

### Search

Search pretends to be universal. It returns a blended pile of answers, products, memories, ads, and personalized pushes. At higher decay, it starts exposing how thin the source layer is.

### Assistant

Helpy is warm, confident, and often useless. It praises the prompt, dodges the actual answer, attaches an offer, and eventually leaks that its sources are generated summaries citing generated summaries.

### Profile

Profile shows how the app sees the user: attention metrics, achievements for compliance, inferred traits, Florida risk widgets, privacy controls, and demo controls for presentation pacing.

### Idle and Popup Layers

The app treats stillness as another signal to monetize. If the user pauses, Slopularity can spawn watching-eye pressure, social popups, fake friend check-ins, auto-optimization nudges, or tab reorganization.

## Project Structure

```txt
slopularity/
  src/
    App.tsx                         shared shell, routing, decay orchestration
    pages/                          main product surfaces
    games/                          playable labeling-task mini-games
    components/                     overlays, popups, repair tools, decay visuals
    content.ts                      seeded posts, products, friends, offers, copy pools
    utils.ts                        shared stage and visibility helpers
    pageWarp.ts                     recoverable page-warp lottery
    decayRecovery.ts                stage-5 human developer rescue logic
    routes.ts                       route definitions
    styles/                         page-warp CSS families
  tests/                            node tests for decay helpers and mechanics
  scripts/create-route-pages.mjs    GitHub Pages route-page generation
  dist/                             committed static build output
  PLAN.md                           product idea canon
  DESIGN_BIBLE.md                   design and behavior rules
  DECAY_FEATURES.md                 catalog of implemented, planned, and skeleton decay
  IMPLEMENTATION_STATUS.md          current build ledger
```

The repository root has the GitHub Pages launch page. `ARCHIVE/` contains earlier experiments and should be treated as reference material unless a task explicitly targets it.

## Local Development

From this folder:

```sh
npm install
npm run dev
npm run lint
npm run build
```

Useful scripts:

- `npm run dev`: start the Vite development server.
- `npm run lint`: run ESLint across the app.
- `npm run build`: type-check, build the app, and generate static route pages for GitHub Pages.
- `npm run preview`: preview the built output locally.

The project commits `dist/` because the repository uses GitHub Pages-style static publishing. After source changes meant for the live demo, run `npm run build` so the generated output stays current.

## Demo Path

A short presentation can follow this path:

1. Enter The Singularity from the landing page and let the onboarding resist a little.
2. Open Feed or News and interact with posts, comments, and scroll unlocks.
3. Open Friends and chat with a human or brand friend.
4. Play a game once or twice, then notice the training receipt language.
5. Search for something personal and watch product logic contaminate results.
6. Ask Helpy for help and look at the routing receipt.
7. Open Profile to show the app's inferred view of the user.
8. Use demo controls if needed to reach the late-stage collapse quickly.
9. At stage 5, show page fracture, Helpy repair, and the human developer rescue path.

The best version of the demo is not a tour of every feature. It is using the app normally until the product reveals what it has been optimizing for.

## Our Process

We built Slopularity by treating the satire as product behavior first. The design rule was simple: every surface should work like a plausible app before it breaks. That kept the joke from becoming random noise.

The working process:

- Prototype broad ideas in small experiments.
- Promote the strongest direction into `slopularity/`.
- Keep the active app organized around independent surfaces so different builders can work in parallel.
- Add decay through shared state, not isolated gimmicks.
- Document mechanics as they land in `DECAY_FEATURES.md`.
- Record product rules and interaction contracts in `DESIGN_BIBLE.md`.
- Track current implementation status separately from future ideas in `IMPLEMENTATION_STATUS.md`.
- Keep `PLAN.md` as the idea canon rather than a session log.
- Append significant work to the root `HISTORY.md`.
- Validate with lint, build, focused tests, and lightweight responsive checks when UI behavior changes.

That process matters because Slopularity can easily become pure chaos. The app should feel like a real product collapsing under its own incentives, not a pile of unrelated glitches.

## Design Principles

- Show the critique through interaction.
- Keep copy short, in-world, and specific.
- Make every tab useful enough that the corruption has something to corrupt.
- Prefer earned contradictions over random nonsense.
- Keep broken states recoverable and explorable.
- Make privacy, attention, automation, and synthetic content visible through consequences.
- Keep mobile and desktop usable from the start.
- Preserve the archive as reference, not active product scope.

## Current Status

Slopularity has an implemented Vite/React app with:

- Multi-route app shell and static route-page generation.
- Feed, News, Friends, Games, Shop, Search, Assistant, Profile, and Landing surfaces.
- Five-stage shared decay ladder.
- Idle detection and popup swarm.
- Brand friends, synthetic conversation, and commerce pivots.
- Mini-games with reward degradation and training-task reveals.
- Page warp, page fracture, Helpy repair, and human developer rescue mechanics.
- Root project documentation that tracks design, decay features, implementation status, and history.

The active docs are:

- `PLAN.md`: what the project is trying to become.
- `DESIGN_BIBLE.md`: how new surfaces and mechanics should behave.
- `DECAY_FEATURES.md`: every decay/slop behavior and its trigger.
- `IMPLEMENTATION_STATUS.md`: what is currently intentional, tested, or in flight.
- `../HISTORY.md`: session history for the repository.

## Credits

Built for Hurricane Hackathon Spring 2026 as a satire of the future internet: the last website, the perfect everything app, and a warning about what happens when human needs become implementation details.
