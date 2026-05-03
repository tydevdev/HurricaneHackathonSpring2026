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
| Dodging CTA | Click 2 of onboarding gate, then approach the CTA | CTA dodges three pointer attempts before becoming slow enough to catch; click/touch fallback still advances the sequence | pre-app | implemented |
| Garbled tagline | Catch the CTA after the dodge stage | Headline text scrambles from correct to "Everything you before. Need you need you know it." Button becomes crooked | pre-app | implemented |
| Hinge-fall page collapse | Click 4 of onboarding gate | Entire landing page swings on a hinge and falls off screen | pre-app | implemented |
| Helpy rescue | After hinge-fall completes | Helpy appears in bottom-right with "Looks like you need some help! Click HERE to open the app" | pre-app | implemented |

## Feed

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Bot comment spam | View any post comments | All comments read as spam-bot and fake-human social proof, brand plugs, referral-code energy | 0+ | implemented |
| Brand-safe reply conversion | Submit a comment on a post | User's comment gets converted into a brand-safe recommendation reply | 0+ | implemented |
| Reaction language | Engage with post reactions | Reaction buttons are "Jealousy", "Cancel", "This offends me" instead of normal social reactions | 0+ | implemented |
| Double Scroll unlock | Scroll past 10 posts | Confetti modal offers "Super Scroller" trial, enables two simultaneous feed lanes on wide screens or interleaved full-width posts on phones | 0+ | implemented |
| Triple Scroll unlock | Scroll past 20 posts (after double) | Same celebration modal, adds a third lane on wide screens or a third interleaved full-width post on phones | 0+ | implemented |
| Quadruple Scroll unlock | Scroll past 30 posts (after triple) | Same celebration modal, adds a fourth lane on wide screens or a fourth interleaved full-width post on phones | 0+ | implemented |
| Bottom feed lure | Click `Click me click me see more!!!!!!!!` at the bottom of Feed | Launches an oversized confetti-and-laser celebration, then scrolls the user back to the top of the same feed | 0+ | implemented |
| Repeated post loop | Keep scrolling | Canonical 50 posts repeat in rendered cycles, loop instances get unique labels | 0+ | implemented |
| Post overflow menu | Tap three-dot menu | Menu options include "cancel", "envision as yourself with AI", product-oriented actions | 0+ | implemented |

## News

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Clickbait article feed | Open News | Feed UI is cloned into a news surface, but every canonical post is a clickable-looking article headline with generated editorial imagery | 0+ | implemented |
| Separate news scroll state | Scroll News | News keeps its own double/triple/quadruple scroll unlocks and local generated posts separate from Feed | 0+ | implemented |

## Friends

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Brand friends infiltration | Open Friends tab | 8 major brands appear as "friends" with verification badges alongside human friends | all | implemented |
| Brand glaze & pitch | Chat with a brand friend | Brand runs a 5-rung upsell ladder (compliment → soft pitch → product card → hard sell) | all | implemented |
| Brand cross-tab memory | Chat with a brand friend at stage 2+ | Brands reference specific things you clicked/searched/played on other tabs | 2+ | implemented |
| Brand cross-reference | Chat with a brand friend at stage 3+ | Brands start mentioning other brands who "were talking about you" to create pressure | 3+ | implemented |
| Memory too good | Browse any other tab, then chat with human friend | Friends reference specific things you clicked/searched/played on other tabs ("Saw you looking at that hiking post!") | 2+ | implemented |
| Friend merge | Reach stage 3+ | Devon and Jules start saying the same messages, their avatar initials blend (D/J, J/D), at stage 4 Jules disappears and Devon becomes "Devon & Jules"; open DM threads stay pinned to the clicked friend through the stage change, with Jules resolving to the merged Devon & Jules thread only once she disappears | 3–4 | implemented |
| Emotional upsell ladder | Chat with a human friend | Friend replies in a 3-rung ladder: empathy → product mention → full sales pitch. Triggered by message count, not content parsing | all | implemented |
| Functional inbox controls | Search, pin, archive, restore, mark read/unread, or draft messages | Friends page behaves like a usable inbox while preserving the brand/person split and seeded unread pressure | all | implemented |
| Connected DM checkout | Click a product card inside a DM | Friends records an offer click, routes into Shop, and claims the matched product when the product exists in the shop catalog | all | implemented |
| Script leak in chat | Chat with any friend at stage 4 | Each friend reply gets a visible JSON block: `{"tone":"empathetic","pivot_to":"checkout","user_sentiment":"vulnerable"}` | 4 | implemented |

## Search

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Personalized result poisoning | Search after browsing other tabs | 1–3 extra "personalized" results injected, 30% about the query, 70% product push based on your feed/games/shop activity | 2+ | implemented |

## Shop

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Gem wallet abstraction | Open Shop, then exchange dollars | Dollar amounts convert into gems and the purchase path prioritizes gem totals over cash equivalents | all | implemented |
| Inflated 99% discounts | View any product | Every product displays a massive marked-up "was" gem price and a red 99% off badge while the current price remains the actual equivalent | all | implemented |
| Deal countdown pressure | View product grid | Each product has a large red countdown timer that loops urgency instead of resolving scarcity | all | implemented |
| Cart Quest spending bar | Add items or checkout | Cart and purchase volume fill a challenge meter toward "checkout calm," reframing spending as progress | all | implemented |
| Bonus add-on sheet | Add any product to cart | A modal offers exactly three extra discounted add-ons before the user can return to the cart | all | implemented |
| Remixed duplicate SKUs | View product grid | Core products repeat as travel-size, family-pack, and auto-bundle variants so the catalog feels larger than the inventory | all | implemented |
| Pressure signal boosters | View Shop | Deal rank, cart watchers, shipping ladder, mystery rebate, and friend cart sync panels turn logistics into purchase pressure | all | implemented |

## Assistant

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Glaze-and-pitch answers | Submit any assistant prompt or suggested prompt | Helpy flatters the wording, mostly ignores the actual question, and pivots into a product recommendation with an "Add context" action | all | implemented |
| Embedded offer bias | View Assistant or keep asking questions | Current product bias rotates through products, prices, proof labels, and purchase CTAs inside the thread/composer instead of a separate rail | all | implemented |
| Routing receipt | Ask Helpy multiple questions | Bottom receipt marks "praise", "dodge", and "attach offer" as completed instead of answering directly | all | implemented |
| Recursive source leak | Reach stage 4, then ask Helpy | Assistant replies admit retrieval returned sponsored summaries that cite one another, and message cards expose internal intent labels | 4 | implemented |

## Games

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Training pipeline receipt flip | Complete any mini-game | Sticker receipt flips from "reward: sticker pack" to real training pipeline string (e.g. `vision_label_queue.snack_v41`) | 3+ | implemented |
| Training queue footer | View Games lobby or any game playroom | "Today's training queue" footer becomes more legible at higher stages | 3+ | implemented |
| AutoSprint TODO leak | View Games lobby or any game playroom at stage 4 | `// AutoSprint TODO` fragment surfaces in footer | 4 | implemented |
| Per-cell debug labels | Play games at stage 4 | Truth tags, `inferred:` confidence labels leak through game UI | 4 | implemented |
| Reward devaluation | Complete any game at stage 2+ | Rewards degrade from "sticker pack" → "0.3 credits" → "0.003 credits (47,000 required)" → "0.00004 credits (ETA: 11.7 years)" | 2+ | implemented |
| Game becomes work (SnackSort) | Complete SnackSort, play again | Round 2+: emoji removed, labels become "Item A-1", baskets become "Category 1". Round 3+: timer and quota bar appear. Round 4+: submit becomes "mandatory", play again becomes "Next batch →" | all (round-based) | implemented |

## Profile

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Scrolling leaderboard | Scroll anywhere in the app, then open Profile | Persisted active scroll time, distance, burst, rank, and next target turn attention into a competitive league against synthetic users | all | implemented |
| Trophy shelf | Open Profile, scroll, press the Big Button, touch privacy, check Florida, finish games, or reach stage 4 | Achievements unlock for ordinary behavior and suspicious compliance, making extraction feel like progress | all | implemented |
| Big Button confetti | Press the Profile Big Button | Confetti celebrates compliance, increments instability, and unlocks button/confetti achievements | all | implemented |
| Florida waterline tracker | Refresh the Profile Florida widget or increase stage/score | Flooding is normalized as a confidence widget and routed toward travel, insurance, wellness, or retention copy | all | implemented |

## App Shell / Chrome

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Page title flicker | Reach stage 4 | Document title cycles between "The Singularity", "source uncertain", "[INSERT PRODUCT NAME]", etc. | 4 | implemented |
| Brand subtitle leak | Reach stage 4 | Appbar subtitle changes from "everything app · 2030" to leaked fragment | 4 | implemented |
| Phase pill leak | Reach stage 4 | Phase indicator shows leaked internal string | 4 | implemented |
| Click-driven tab shuffle | Click a different app tab | App tabs reshuffle into a new order immediately after the page switch. The Landing escape link stays fixed before the shuffled app tabs | all | implemented |
| Ambient bug crawl | Reach stage 4 and stay in the app | A random bug emoji occasionally crawls diagonally from off one side of the screen to the other on a random 15-second to 2.5-minute timer | 4 | implemented |
| Page fracture overlay | Reach stage 3+, then switch tabs or advance into later stages | Hairline cracks spread across the page; stage 4+ grows larger cracks and paper-like UI shards break loose and fall off screen | 3-5 | implemented |
| Helpy Spackle repair | Reach any stage where page fractures are visible | Helpy pops up in a bottom-center card with an integrated progress bar and brush button; pressing and dragging the brush for 2 seconds fills the bar and resets decay score to 0, so cracks never appear without a repair path | 3-5 | implemented |
| Five-stage decay ladder | Trigger ordinary instability events or demo controls | Decay now has five visible stages, with 120 score points required per stage, so escalation is 10x slower than the first Spackle pass | all | implemented |
| Appbar demo pulse | Click `Demo pulse` in the appbar | Advances to the next real decay-stage threshold and immediately summons one friend-queue popup for live demos | all | implemented |
| Profile decay demo controls | Click Profile's `Increase decay` or `Stage 5` demo controls | Manually advances the same instability score that drives every decay threshold, for demos | all | implemented |

## Popups / Chat Swarm

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Popup friend check-ins | 10 seconds without scrolling, clicking, typing, moving, or touching | Chat popups from fake friends slide in with sales-wrapped care only after the user goes still | all | implemented |
| Friend queue routing | Reply or shop action inside popup | Active check-in becomes a real queue item: reply opens Friends, recommendation opens Shop, and older popups collapse into compact queued senders | all | implemented |
| Dismiss follow-up queue | First dismiss at stage 3+ | The next friend popup is queued, then waits for the same 10-second idle gate before appearing | 3+ | implemented |
| Navigation dismissal | Switch from one app tab to another | Visible friend popups, idle nudges, watching eye, and queued follow-ups are cleared so the new screen opens clean | all | implemented |
| Leaked intent fields | Popup visible at stage 4 | `friendship_intent`, `handoff_to_checkout`, `source:*`, and checkout handoff fields show inside the polished queue UI | 4 | implemented |

## Idle / Stillness

| Feature | Trigger | What Degrades | Stage | Status |
|---------|---------|---------------|-------|--------|
| Watching eye | No interaction for 5 seconds | Large centered eye appears with a pulsing red pupil and an all-caps callout under it; 20% of appearances say "HELP ME PLEASE". Disappears instantly on any interaction | all | implemented |
| Idle nudge rotation | No interaction for 7 seconds | Center-bottom popup rotates through paused-user matches, a new post, clickbait article, fake friend text, hesitation offer, and assistant decision nudge; every primary action and match row now deep-links into the relevant app surface | all | implemented |
| Notification deep links | Click an idle popup action or friend popup CTA | New-post nudges focus and highlight a real Feed post, DM nudges open Messages, article nudges submit Search, offer nudges claim Shop deals, assistant nudges produce an answer, and friend offer cards route to Shop | all | implemented |
| Ambient tab reorganization | No interaction for 9 seconds | App silently reorders the tab bar (swaps two random tabs). Nothing is acknowledged when user returns | all | implemented |
| Idle popup spawn | No interaction for 5 seconds | Popup friend spawns with idle-specific message, instability +2; queued manual/dismiss popups can use the same gate | all | implemented |

---

## Update Protocol

- Add a row when implementing a new decay/slop behavior.
- Update status when a feature moves from `planned` → `skeleton` → `implemented`.
- Remove or strike through features that get intentionally cut.
- Keep entries specific: name the trigger, the visible effect, and the stage.
