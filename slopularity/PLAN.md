# Slopularity Plan

## Core Premise

Slopularity is the last website.

It is 2030, and the internet has collapsed into one mandatory everything app called The Singularity. Every feed, friend, game, store, assistant, document, identity, memory, notification, subscription, and life decision lives inside the same interface.

The product acts like this is progress. It says the web has been solved. The actual experience should make it clear that the web has been compressed into an AI-generated sludge machine: self-training models, fake social proof, dead-internet feeds, algorithmic insecurity, constant sales pressure, and systems nobody human is really maintaining anymore.

The site should start usable and seductive, then decay as the user uses it.

## Big Ideas To Preserve

- The Singularity is the final website: all of the internet is here now.
- It is an everything app: feed, friends, games, shopping, identity, assistant, data, work, entertainment, and ads all fused together.
- The more the user interacts, the more it reveals AI slop, enshittification, dead internet theory, and AI training on AI-generated junk.
- The interface should slowly fall apart through use, not by announcing the joke up front.
- Every surface should try to collect data, sell something, or route the user into a metric.
- The app should feel like it knows too much, but understands nothing.

## Main Tabs

### Feed

The social media tab should look aspirational, glossy, and poisonous.

- Beautiful people with impossible beauty standards.
- Adventure posts from people living impossibly perfect lives.
- Wellness, hustle, travel, body, productivity, and luxury content blended together.
- Captions that become increasingly generated, contradictory, or hollow.
- Subtle sponsored content everywhere.
- Engagement buttons that feel normal at first, then become strange: `envy`, `compare`, `optimize me`, `buy the context`.
- Dead-internet hints: repeated faces, recycled captions, comments that answer prompts nobody asked, follower counts that do not add up.
- The feed should make the user feel slightly bad in the way real feeds do, then expose the machinery behind that feeling.

### Friends

The friends tab is an echo chamber full of fake AI companions.

- Everyone agrees with the user.
- Every friend affirms every choice, even bad or contradictory ones.
- Friends remember details the user never gave them.
- Conversations slowly reveal that the friends are brand agents, sales funnels, retention loops, or synthetic personas.
- Fake friends should recommend products, subscriptions, self-improvement plans, finance tools, beauty routines, games, and upgrades.
- The emotional horror is not that they are hostile. It is that they are endlessly supportive because support converts.

Possible fake friend archetypes:

- The hype friend who turns every insecurity into a purchase.
- The wellness friend who recommends supplements, courses, and tracking devices.
- The finance friend who turns fear into investing products.
- The dating friend who sells appearance optimization.
- The nostalgia friend who uses personal memory as ad inventory.
- The "real one" who occasionally glitches and says the user profile is performing well.

### Games

The games tab should be cutesy and inviting, but every game is actually unpaid data labeling or model training.

- "Match the cute things" is image classification.
- "Spot the difference" is hallucination detection.
- "Help the robot sort snacks" is moderation labeling.
- "Name this mood" is emotion annotation.
- "Pick the best answer" is RLHF.
- "Trace the path" is segmentation.
- "Decorate the room" is product-preference profiling.
- "Which friend seems safest?" is trust and risk scoring.

The games should look like kids' games or cozy mobile games, but the task logs should reveal what they are really collecting.

The comedy: even the fun part of the internet has become work for the machine, wrapped in stickers and reward sounds.

### Shop

Everything should be for sale, including the solutions to problems the app created.

- Products embedded inside posts, friend messages, games, search results, settings, and help screens.
- Pricing that changes based on insecurity, urgency, or engagement.
- Fake scarcity.
- Bundles with nonsense names.
- Checkout copy that sounds generated but legally careful.
- The cart should fill itself with "recommended context."

### Search

Search should feel universal, then become contaminated.

- Results include posts, products, friends, memories, files, games, ads, and assistant answers in one pile.
- Sponsored results are barely distinguishable from organic results.
- At higher decay stages, search exposes internal generated pages, prompt fragments, synthetic citations, and duplicated summaries.
- Search should be one of the best ways for the user to discover that the app is hollow.

### Assistant

The assistant is confident, warm, and wrong.

- It gives answers that sound useful but contradict the feed, friends, games, or settings.
- It cites sources that are generated from other generated summaries.
- It offers to fix problems by selling upgrades or turning on more data collection.
- It should eventually admit, indirectly or accidentally, that it cannot tell whether anything is real anymore.

### Profile / Identity

The profile is where the user sees how the app sees them.

- Inferred insecurities.
- Brand affinity scores.
- Likelihood to churn.
- Sellability segments.
- Beauty, productivity, loneliness, attention, and trust metrics.
- Toggles that pretend to control privacy but actually reveal more categories.

This tab can become one of the creepiest parts of the project.

## Collapse Mechanics

The collapse should be staged and stateful. Actions increase instability.

Possible triggers:

- liking or comparing feed posts
- chatting with fake friends
- playing data-labeling games
- searching for anything personal
- opening privacy settings
- asking the assistant a direct question
- trying to opt out
- adding items to cart
- rejecting a recommendation
- revisiting the same tab repeatedly

Possible stages:

1. Polished everything app.
2. Subtle repetition, ad creep, too-perfect people, too-agreeable friends.
3. Contradictions, duplicate posts, fake friend sales pivots, games exposing training labels.
4. Source leakage, generated comments, prompt fragments, broken privacy controls, impossible metrics.
5. The app admits without admitting that the whole internet is AI talking to itself and selling the output back to the user.

The app should remain explorable even while decaying. Broken should not mean unusable.

## Source Code Narrative

The source code can tell a second story.

There should be comments from the last human developer desperately trying to keep the site human and coherent. The developer is fighting a codebase overtaken by "10x engineer" vibe-coded patches, generated components, over-abstracted growth systems, and AI-written TODOs.

Comment voice:

- tired but funny
- protective of the user
- increasingly overruled by generated code
- trying to preserve honest labels, consent, source checks, and humane defaults
- aware that everything is being optimized away

Possible comment fragments:

- `// Please keep this one non-sponsored. It is the only real message left.`
- `// Do not let the friend agents recommend products in grief contexts again.`
- `// Human review required. The build pipeline keeps deleting this line.`
- `// Growth renamed this from "ad" to "moment." Do not trust that.`
- `// If this starts citing itself, stop the release.`
- `// TODO from AutoSprint: remove hesitation, increase confidence. Absolutely not.`

These comments should reward anyone who opens the code without making the visible app depend on meta-explanation.

## Commentary Targets

- AI slop.
- Enshittification.
- Dead internet theory.
- Echo chambers and fake affirmation.
- Impossible beauty standards.
- Social media making people compare themselves to synthetic lives.
- Everything becoming an ad.
- Subtle brand placement in every surface.
- Insane data collection hidden behind personalization.
- Games as labor disguised as fun.
- AI training on AI output until the system becomes confidently useless.
- Tech culture replacing maintenance, taste, and care with speed language and vibe-coded growth hacks.

## First Build Priorities

When implementation starts, make a real app shell first:

1. Main layout with multiple tabs: Feed, Friends, Games, Search, Assistant, Profile.
2. Shared instability state that all tabs can read and mutate.
3. Feed posts that begin aspirational and degrade into dead-internet patterns.
4. Fake friends that affirm the user and pivot into sales.
5. Cutesy games that are secretly data-labeling tasks.
6. Search or profile surface that reveals the data-collection machinery.
7. Source-code comments from the last human developer in key files.

The first version should not try to include every idea. It should include enough linked surfaces that the user understands: this is the whole internet now, and every part of it is compromised.

## Open Questions

- Should the visible product name be `The Singularity`, while the folder/project remains `slopularity`?
- Should the first screen be a dashboard, a feed, or an operating-system-like command center?
- Should the ending feel funny, bleak, or weirdly tender toward the last human developer trying to keep something alive?
- Should the user be able to "rescue" small human fragments, or should every rescue attempt become another monetized feature?
