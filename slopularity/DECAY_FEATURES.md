# Slopularity Decay & Slop Feature Tracker

This document catalogs every implemented (or planned-and-wired) decay, slop, and degradation behavior in the Slopularity project. Update this file whenever a decay/slop feature is added, changed, removed, or promoted from skeleton to intentional.

## How To Read This

Each entry includes:

- **Feature**: short name
- **Surface**: which tab/page/layer it lives on
- **Trigger**: what user action or threshold activates it
- **What Degrades**: what the user sees change
- **Stage**: which collapse stage it appears at (0–4, or "all")
- **Status**: `implemented`, `skeleton`, or `planned`

---

## Onboarding

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Onboarding gate loop | Click "Enter the Singularity" (click 1) | Page appears to navigate but returns with UI elements shuffled and button repositioned | pre-app | implemented |
| Garbled tagline | Click 2 of onboarding gate | Headline text scrambles from correct to "Everything you before. Need you need you know it." Button becomes crooked | pre-app | implemented |
| Hinge-fall page collapse | Click 3 of onboarding gate | Entire landing page swings on a hinge and falls off screen | pre-app | implemented |
| Helpy rescue | After hinge-fall completes | Helpy appears in bottom-right with "Looks like you need some help! Click HERE to open the app" | pre-app | implemented |

## Feed

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Bot comment spam | View any post comments | All comments read as spam-bot and fake-human social proof, brand plugs, referral-code energy | 0+ | implemented |
| Brand-safe reply conversion | Submit a comment on a post | User's comment gets converted into a brand-safe recommendation reply | 0+ | implemented |
| Reaction language | Engage with post reactions | Reaction buttons are "Jealousy", "Cancel", "This offends me" instead of normal social reactions | 0+ | implemented |
| Double Scroll unlock | Scroll past 10 posts | Confetti modal offers "Super Scroller" trial, enables two simultaneous feed lanes on wide screens or interleaved full-width posts on phones | 0+ | implemented |
| Triple Scroll unlock | Scroll past 20 posts (after double) | Same celebration modal, adds a third lane on wide screens or a third interleaved full-width post on phones | 0+ | implemented |
| Repeated post loop | Keep scrolling | Canonical 50 posts repeat in rendered cycles, loop instances get unique labels | 0+ | implemented |
| Post overflow menu | Tap three-dot menu | Menu options include "cancel", "envision as yourself with AI", product-oriented actions | 0+ | implemented |

## Friends

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Memory too good | Browse any other tab, then visit Friends | Friends reference specific things you clicked/searched/played on other tabs ("Saw you looking at that hiking post!") | 2+ | implemented |
| Friend merge | Reach stage 3+ | Devon and Jules start saying the same messages, their avatar initials blend (D/J, J/D), at stage 4 Jules disappears and Devon becomes "Devon & Jules" | 3–4 | implemented |
| Emotional upsell ladder | Type a message to any friend | Friend replies in a 3-rung ladder: empathy → product mention → full sales pitch. Triggered by message count, not content parsing | all | implemented |
| Script leak in chat | Chat with a friend at stage 4 | Each friend reply gets a visible JSON block: `{"tone":"empathetic","pivot_to":"checkout","user_sentiment":"vulnerable"}` | 4 | implemented |

## Search

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Personalized result poisoning | Search after browsing other tabs | 1–3 extra "personalized" results injected, 30% about the query, 70% product push based on your feed/games/shop activity | 2+ | implemented |

## Assistant

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Glaze-and-pitch answers | Submit any assistant prompt or suggested prompt | Helpy flatters the wording, mostly ignores the actual question, and pivots into a product recommendation with an "Add context" action | all | implemented |
| Sponsored fit rail | View Assistant or keep asking questions | Side recommendation rotates through products, prices, proof labels, and purchase CTAs based on conversation count and stage | all | implemented |
| Routing receipt | Ask Helpy multiple questions | Status rail marks "praise user", "avoid exact question", and "attach product" as completed instead of answering directly | all | implemented |
| Recursive source leak | Reach stage 4, then ask Helpy | Assistant replies admit retrieval returned sponsored summaries that cite one another, and message cards expose internal intent labels | 4 | implemented |

## Games

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Training pipeline receipt flip | Complete any mini-game | Sticker receipt flips from "reward: sticker pack" to real training pipeline string (e.g. `vision_label_queue.snack_v41`) | 3+ | implemented |
| Training queue footer | View games tab | "Today's training queue" footer becomes more legible at higher stages | 3+ | implemented |
| AutoSprint TODO leak | View games tab at stage 4 | `// AutoSprint TODO` fragment surfaces in footer | 4 | implemented |
| Per-cell debug labels | Play games at stage 4 | Truth tags, `inferred:` confidence labels leak through game UI | 4 | implemented |
| Reward devaluation | Complete any game at stage 2+ | Rewards degrade from "sticker pack" → "0.3 credits" → "0.003 credits (47,000 required)" → "0.00004 credits (ETA: 11.7 years)" | 2+ | implemented |
| Game becomes work (SnackSort) | Complete SnackSort, play again | Round 2+: emoji removed, labels become "Item A-1", baskets become "Category 1". Round 3+: timer and quota bar appear. Round 4+: submit becomes "mandatory", play again becomes "Next batch →" | all (round-based) | implemented |

## App Shell / Chrome

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Page title flicker | Reach stage 4 | Document title cycles between "The Singularity", "source uncertain", "[INSERT PRODUCT NAME]", etc. | 4 | implemented |
| Brand subtitle leak | Reach stage 4 | Appbar subtitle changes from "everything app · 2030" to leaked fragment | 4 | implemented |
| Phase pill leak | Reach stage 4 | Phase indicator shows leaked internal string | 4 | implemented |

## Popups / Chat Swarm

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Popup friend check-ins | 10 seconds without scrolling, clicking, typing, moving, or touching | Chat popups from fake friends slide in with sales-wrapped care only after the user goes still | all | implemented |
| Queued demo / dismiss follow-up | Demo pulse or first dismiss at stage 3+ | The next friend popup is queued, then waits for the same 10-second idle gate before appearing | 3+ | implemented |
| Navigation dismissal | Switch from one app tab to another | Visible friend popups, idle nudges, watching eye, and queued follow-ups are cleared so the new screen opens clean | all | implemented |
| Leaked intent fields | Popup visible at stage 4 | `friendship_intent`, `handoff_to_checkout`, `abandonment_risk` show in popup small text | 4 | implemented |

## Idle / Stillness

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Watching eye | No interaction for 5 seconds | Large centered eye appears with a pulsing red pupil and an all-caps callout under it; 20% of appearances say "HELP ME PLEASE". Disappears instantly on any interaction | all | implemented |
| Idle nudge rotation | No interaction for 7 seconds | Center-bottom popup rotates through paused-user matches, a new post, clickbait article, fake friend text, hesitation offer, and assistant decision nudge | all | implemented |
| Ambient tab reorganization | No interaction for 9 seconds | App silently reorders the tab bar (swaps two random tabs). Nothing is acknowledged when user returns | all | implemented |
| Idle popup spawn | No interaction for 5 seconds | Popup friend spawns with idle-specific message, instability +2; queued manual/dismiss popups can use the same gate | all | implemented |

---

## Update Protocol

- Add a row when implementing a new decay/slop behavior.
- Update status when a feature moves from `planned` → `skeleton` → `implemented`.
- Remove or strike through features that get intentionally cut.
- Keep entries specific: name the trigger, the visible effect, and the stage.
