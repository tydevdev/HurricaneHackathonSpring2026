# Hurricane Hackathon Spring 2026

This repository began as a hackathon lab for small product tests. Going forward, `slopularity/` is the project. Assume new product work belongs there unless the user explicitly names another folder.

The earlier top-level projects were built to figure out the direction. Treat them as experiments, references, prototypes, or inspiration only; do not continue expanding them by default.

## Repository Shape

- `index.html` is the GitHub Pages root. It exists only to introduce the hackathon workspace and link into the subprojects.
- `styles.css` styles the root hub page.
- `slopularity/` is the primary project folder and the default working area for this repository. It is currently a planning shell for the real build, not an implemented app yet.
- Earlier Vite demos include `time-capsules/`, `365 buttons/`, `scrollbreak/`, `pocket-zoo/`, `fun-internet-museum/`, `pixel-pop-arcade/`, `slopternet/`, and `quiet-collapse/`.
- `slopternet/` and `quiet-collapse/` are especially relevant references for AI-slop and trust-collapse mechanics, but they are prior experiments, not active product tracks.
- `whimsy-net/` and other top-level folders are earlier idea or scaffold folders. Leave all non-`slopularity/` folders alone unless the user explicitly asks to work on one.
- Do not merge subprojects into one app unless the user explicitly asks for that.

## Primary Project Direction

- The active project is `slopularity/`, a future-facing web app set around 2030: the "everything app" after AI has supposedly unified every product, workflow, feed, assistant, dashboard, marketplace, and personal tool.
- The core joke and critique: the product poses as the singularity of websites, but because it is AI-made and unchecked, it is basically slop. As the user uses it, the interface should slowly fall apart.
- Use `quiet-collapse/` as a reference for gradual degradation, stateful discoveries, and trust failure. This project should feel broader and more like a super app: search, social, productivity, commerce, identity, assistant, files, feeds, and automation all collapsing into one overconfident surface.
- Do not implement `slopularity/` until the user asks for implementation. For now, preserve the README and local AGENTS file as durable product direction.
- Future implementation should make degradation interactive and earned: user actions should trigger contradictions, duplicate panels, fake integrations, generated artifacts, confident wrongness, layout drift, memory leaks, and recovery paths.
- Keep the first version understandable without explanatory copy. The app should demonstrate the satire through behavior, not through visible text announcing the premise.

## Development Workflow

- Work inside `slopularity/` by default.
- Work inside another subproject folder only when the user explicitly targets that subproject.
- Do root-only changes at the repository root.
- For Vite subprojects, use their local scripts from inside that folder:
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- Keep the GitHub Pages root lightweight and static so it can act as a reliable launch board.

## Root Page Rules

- The root page should connect to subprojects without changing the subprojects themselves.
- When adding a new published subproject, add a link for its static `dist/` page on the root page.
- Keep Vite build output committed for published experiments so GitHub Pages can serve the linked pages.
- If a folder does not have a page yet, mark it clearly instead of pretending it is live.
- Preserve relative links so GitHub Pages works from the repository root.

## Demo Quality

- Treat every project as a demo, but never as disposable. Each one should feel polished, well fleshed out, and built with care.
- Make the core interaction complete enough that a real visitor can understand the idea, use it, and see why it is interesting without reading extra explanation.
- For websites and browser apps, design and verify both desktop and phone experiences before calling the work done.
- Websites must look great on computer and phone: responsive layout, readable text, no awkward overflow, no broken spacing, and no important controls hidden off-screen.
- Websites must be fully interactable on computer and phone: mouse, keyboard where relevant, touch targets, scrolling, forms, buttons, menus, gestures, and game controls should work in the appropriate viewport.
- When practical, verify responsive behavior with both a desktop browser viewport and a phone-sized viewport, then record that validation in `HISTORY.md`.

## Maintenance

- `HISTORY.md` is required and must be kept current.
- Append a new entry for every significant task or session.
- Use this format: `## [YYYY-MM-DD HH:mm] Title`, followed by flat bullets.
- Never overwrite, delete, or reorder prior history entries.
- Create `HISTORY.md` if it is missing.
- Entries must be specific: name files changed, behavior impact, and validation run.

## Commits

- Commit in small, reviewable increments during active work.
- Use descriptive commit messages tied to behavior changes.
- Run the relevant checks before pushing.
- Avoid giant end-of-session commits when multiple logical changes occurred.

## Subagent Acceleration

- Treat subagents as a default speed tool, not a last resort.
- For every actionable task, actively look for parallel work that can be delegated immediately: codebase exploration, independent implementation slices, research, verification, design critique, test review, risk hunting, or cleanup.
- Keep subagents working constantly whenever there is any useful independent thread of work; prefer one primary local path plus parallel support over a single-agent bottleneck.
- Use multiple subagents when the task has separable surfaces, such as different subprojects, UI and data logic, implementation and testing, or build debugging and product polish.
- For image generation work, exclusively delegate generation to subagents. The main agent should write direction, review results, and integrate assets, but must not generate images directly.
- When directing image-generation subagents, specify `transparent background` when the asset should have no backdrop; the image generator can return transparent-background images when explicitly asked.
- Give each subagent concrete ownership, clear output expectations, and file boundaries when editing is involved.
- Integrate subagent results yourself so the final outcome feels cohesive, fast, and finished.

## Parallel Agent Stability

- Multiple agents editing in parallel is normal in this workspace.
- Do not assume unrelated dirty files mean the repo is broken.
- Scope edits to requested files and avoid touching in-progress files owned by others.
- Ignore unrelated local changes by default unless explicitly asked to manage them.
- Do not block progress solely because other agent activity is present.

## Product Taste

- This repo is for fast experiments, but each project should still feel considered, useful, and cared for.
- Prefer small, memorable improvements over broad rewrites.
- Keep visible copy short, clear, and native to the project.
- Make delightful details earn their place through behavior, polish, or clarity.
