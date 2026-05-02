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
| Double Scroll unlock | Scroll past 10 posts | Confetti modal offers "Super Scroller" trial, enables two simultaneous feed lanes | 0+ | implemented |
| Triple Scroll unlock | Scroll past 20 posts (after double) | Same celebration modal, adds a third feed lane | 0+ | implemented |
| Repeated post loop | Keep scrolling | Canonical 50 posts repeat in rendered cycles, loop instances get unique labels | 0+ | implemented |
| Post overflow menu | Tap three-dot menu | Menu options include "cancel", "envision as yourself with AI", product-oriented actions | 0+ | implemented |

## Games

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Training pipeline receipt flip | Complete any mini-game | Sticker receipt flips from "reward: sticker pack" to real training pipeline string (e.g. `vision_label_queue.snack_v41`) | 3+ | implemented |
| Training queue footer | View games tab | "Today's training queue" footer becomes more legible at higher stages | 3+ | implemented |
| AutoSprint TODO leak | View games tab at stage 4 | `// AutoSprint TODO` fragment surfaces in footer | 4 | implemented |
| Per-cell debug labels | Play games at stage 4 | Truth tags, `inferred:` confidence labels leak through game UI | 4 | implemented |

## App Shell / Chrome

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Page title flicker | Reach stage 4 | Document title cycles between "The Singularity", "source uncertain", "[INSERT PRODUCT NAME]", etc. | 4 | implemented |
| Brand subtitle leak | Reach stage 4 | Appbar subtitle changes from "everything app · 2030" to leaked fragment | 4 | implemented |
| Phase pill leak | Reach stage 4 | Phase indicator shows leaked internal string | 4 | implemented |

## Popups / Chat Swarm

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Popup friend check-ins | Idle time / manual demo pulse / tab actions | Chat popups from fake friends slide in with sales-wrapped care | all | skeleton (feature-flagged off) |
| Dismiss follow-up | Dismiss a popup at stage 3+ | One softer follow-up popup spawns after first dismiss (one-shot per session) | 3+ | skeleton (feature-flagged off) |
| Leaked intent fields | Popup visible at stage 4 | `friendship_intent`, `handoff_to_checkout`, `abandonment_risk` show in popup small text | 4 | skeleton (feature-flagged off) |

## Idle / Stillness

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Idle popup spawn | No interaction for 9 seconds | Popup friend spawns with idle-specific message, instability +2 | all | skeleton (feature-flagged off) |

---

## Update Protocol

- Add a row when implementing a new decay/slop behavior.
- Update status when a feature moves from `planned` → `skeleton` → `implemented`.
- Remove or strike through features that get intentionally cut.
- Keep entries specific: name the trigger, the visible effect, and the stage.
