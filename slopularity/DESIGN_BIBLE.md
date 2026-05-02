# Slopularity Design Bible

This is the product and design spine for `slopularity/`. `PLAN.md` tracks ideas, mechanics, and future build priorities. This file translates those ideas into execution rules: how The Singularity should look, sound, behave, decay, and stay coherent as multiple agents add sections.

Keep this document alive. When a section, tab, mechanic, visual system, or narrative rule changes in implementation, update the matching section here with the intention behind the change.

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

   Prompt fragments, synthetic citations, duplicate panels, impossible metrics, last-human-developer comments, and recovery controls break through the product surface.

The app can look compromised, but it should remain navigable. The user should feel trapped inside a working system, not blocked by a nonfunctional page.

## Interaction Rules

- Every meaningful user action should either reveal a new contradiction, increase instability, or create a data trail the app can later misuse.
- Dismissal is a signal. Closing, ignoring, rejecting, pausing, or opting out should still affect the system.
- Idle time matters. Stillness should eventually trigger check-ins, guesses, optimizations, or profile changes.
- Reset and recovery controls may exist, but they should feel like product controls, not developer debug buttons.
- Collapse should be deterministic enough for demos. Avoid random-only progression that makes a presentation miss the best beats.
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

The feed should start glossy and emotionally familiar: wellness, adventure, productivity, beauty, travel, luxury, and self-improvement blended into one scroll. As instability rises, the feed should reveal repeated faces, recycled captions, comments answering unseen prompts, fake engagement, impossible sponsor placement, and action labels that turn insecurity into product flow.

Interaction hooks:

- compare, envy, optimize, save, buy context
- repeated scrolls that mutate captions or counts
- sponsor disclosures that move, soften, or rename themselves
- posts that reappear with tiny differences

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

Popups should first read as social notifications. They should slide in with intimate timing, follow the user across tabs, react to hesitation or idle time, and return softer after dismissal.

Interaction hooks:

- dismissing creates a gentler follow-up
- multiple popups compete over the same conversion
- blocking becomes paid or asks for more preference data
- leaked fields such as `friendship_intent`, `handoff_to_checkout`, or `abandonment_risk`

### Idle Attention

Intention: the app cannot let the user simply exist.

Stillness should be interpreted as loneliness, hesitation, confusion, churn risk, insecurity, or buyer intent. On desktop, use mouse, scroll, keyboard, focus, and click signals. On phone, use touch, scroll, orientation, visibility, and time since last tap.

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

### Shop

Intention: the app sells solutions to problems it created.

The shop should feel embedded everywhere, not isolated. Products should appear inside posts, friend messages, assistant answers, search results, settings, profile insights, and games.

Interaction hooks:

- cart fills with recommended context
- pricing shifts based on urgency, insecurity, or engagement
- bundles with generated names
- scarcity language that contradicts inventory or user history

### Search

Intention: universal search contaminated by incentives.

Search should initially feel powerful: one box for posts, products, people, files, games, memories, answers, and settings. It should later expose sponsored ranking, synthetic citations, generated summaries citing generated summaries, internal routes, prompt fragments, and duplicate pages.

Interaction hooks:

- personal queries increase instability faster
- sponsored and organic results blur
- source chains become circular
- results reveal hidden machinery before other tabs do

### Assistant

Intention: warmth plus confident wrongness.

The assistant should sound useful, calm, and competent. It should contradict other surfaces, cite questionable sources, sell fixes to its own errors, and slowly reveal it cannot distinguish real source material from generated residue.

Interaction hooks:

- direct questions produce plausible but inconsistent answers
- citations degrade into summaries of summaries
- fixes require upgrades or more data access
- late-stage replies leak prompt or policy fragments

### Profile / Identity

Intention: the app shows how it sees the user.

The profile should be one of the creepiest surfaces because it turns behavior into labels. It should expose inferred insecurities, churn risk, sellability, attention patterns, beauty/productivity/loneliness/trust metrics, brand affinity, and privacy toggles that reveal more categories than they hide.

Interaction hooks:

- every tab updates profile assumptions
- toggles pretend to protect privacy while expanding the profile
- labels become more intimate after idle time or friend chats
- "why am I seeing this?" opens more surveillance context

## Collapse System

Use one shared instability model with named events. Favor explicit events like `feed_compare`, `friend_sales_pivot`, `game_label_submitted`, `search_personal_query`, `assistant_direct_question`, `profile_privacy_toggle`, `popup_dismissed`, `idle_pause_detected`, and `cart_context_added`.

Each event should be easy to trace from UI action to state change. Each threshold should unlock surface changes across more than one tab so the world feels connected.

Recommended thresholds:

- stage 0: polished and plausible
- stage 1: subtle ad creep and overfamiliarity
- stage 2: contradictions and duplicates
- stage 3: internal labels, synthetic sources, task logs
- stage 4: source leakage, broken controls, final reveal path

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

## Keeping This Updated

When adding or changing a major section, update that section here with:

- intention: what the surface should make the user experience
- behavior: what changes through interaction
- collapse hooks: which events or thresholds affect it
- copy rules: any local vocabulary or forbidden framing
- verification notes: desktop, phone, accessibility, reduced motion, or demo-path concerns

If implementation changes the product direction, update `PLAN.md` for the idea and this file for the execution rule. If only execution details change, update this file and leave `PLAN.md` alone.
