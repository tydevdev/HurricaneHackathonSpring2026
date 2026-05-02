# Hurricane Hackathon Spring 2026

This repository began as a hackathon lab for small product tests. Going forward, `slopularity/` is the project. Assume new product work belongs there unless the user explicitly names another folder.

The earlier projects were built to figure out the direction and now live under `ARCHIVE/`. Treat them as experiments, references, prototypes, or inspiration only; do not continue expanding them by default.

## Repository Shape

- `index.html` is the GitHub Pages root. It exists only to introduce the hackathon workspace and link into the subprojects.
- `styles.css` styles the root hub page.
- `slopularity/` is the primary project folder and the default working area for this repository. It now has the first Vite/React skeleton for The Singularity.
- `ARCHIVE/` holds the earlier experiments and reference projects.
- Earlier Vite demos include `ARCHIVE/time-capsules/`, `ARCHIVE/365 buttons/`, `ARCHIVE/scrollbreak/`, `ARCHIVE/pocket-zoo/`, `ARCHIVE/fun-internet-museum/`, `ARCHIVE/pixel-pop-arcade/`, `ARCHIVE/slopternet/`, and `ARCHIVE/quiet-collapse/`.
- `ARCHIVE/slopternet/` and `ARCHIVE/quiet-collapse/` are especially relevant references for AI-slop and trust-collapse mechanics, but they are prior experiments, not active product tracks.
- `ARCHIVE/whimsy-net/` and other archived folders are earlier idea or scaffold folders. Leave all non-`slopularity/` folders alone unless the user explicitly asks to work on one.
- Do not merge subprojects into one app unless the user explicitly asks for that.

## Primary Project Direction

- The active project is `slopularity/`, a future-facing web app set around 2030: the "everything app" after AI has supposedly unified every product, workflow, feed, assistant, dashboard, marketplace, and personal tool.
- The core joke and critique: the product poses as the singularity of websites, but because it is AI-made and unchecked, it is basically slop. As the user uses it, the interface should slowly fall apart.
- Use `quiet-collapse/` as a reference for gradual degradation, stateful discoveries, and trust failure. This project should feel broader and more like a super app: search, social, productivity, commerce, identity, assistant, files, feeds, and automation all collapsing into one overconfident surface.
- Future implementation should make degradation interactive and earned: user actions should trigger contradictions, duplicate panels, fake integrations, generated artifacts, confident wrongness, layout drift, memory leaks, and recovery paths.
- Keep the first version understandable without explanatory copy. The app should demonstrate the satire through behavior, not through visible text announcing the premise.
- Use `slopularity/PLAN.md` for idea tracking and `slopularity/DESIGN_BIBLE.md` for product/design execution rules. Future agents should update the design bible whenever a major section, mechanic, visual language, copy rule, collapse behavior, or responsive expectation changes.
- For each substantial `slopularity/` section change, record the intention behind the section in `DESIGN_BIBLE.md`: what the user should experience, how interaction changes it, which collapse hooks affect it, and what future agents must preserve.
- Use `slopularity/IMPLEMENTATION_STATUS.md` for periodic current-state notes: what is actively being implemented with intention, what remains a skeleton, which feature flags are temporarily off for testing, and what was validated. Keep `PLAN.md` focused on product ideas rather than session-by-session status.

## Development Workflow

- Before implementing new features, pull the latest remote changes and resolve merge conflicts or open merge-request fallout when practical. Keep the working tree current so new work starts from the freshest shared state instead of piling features on top of avoidable drift.
- If pulling exposes conflicts, broken builds, or review/merge-request fixes that clearly block the requested work, handle those first. Resolve straightforward conflicts directly; pause only when the correct product or code decision is genuinely ambiguous.
- Work inside `slopularity/` by default.
- Work inside an archived subproject folder only when the user explicitly targets that subproject.
- Do root-only changes at the repository root.
- Build every active web app for both full desktop pages and phone-sized screens from the start. Do not treat mobile as a late cleanup pass.
- For Vite subprojects, use their local scripts from inside that folder:
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- Keep the GitHub Pages root lightweight and static so it can act as a reliable launch board.

## Coding Practices

- Read the existing component, state, styling, and content patterns before editing. Extend the local shape first; introduce new architecture only when it clearly reduces complexity.
- Prefer small, named React components, plain TypeScript types, and explicit helper functions over dense inline logic. A future agent should be able to skim the main flow in under a minute.
- Keep state transitions understandable and deterministic. For `slopularity/`, degradation mechanics should be driven by clear user actions, named events, and inspectable thresholds rather than scattered one-off mutations.
- Use semantic HTML, accessible labels, keyboard-friendly controls, visible focus states, and touch-sized targets as part of normal implementation work.
- Keep copy short and in-world. Do not add visible explanation that describes the joke, the design intent, or the mechanics from outside the product.
- Treat responsive layout as product logic, not cleanup. Use stable dimensions, sensible grid/flex constraints, and explicit overflow handling so desktop and phone views remain usable.
- Add dependencies only when they earn their weight. Prefer Vite/React/browser-native APIs and existing project helpers unless a proven library handles a real domain problem better.
- Keep generated or published assets organized in the relevant project folder. For published Vite demos, update `dist/` after source changes so GitHub Pages links keep working.
- Handle empty, loading, error, reset, and reduced-motion states deliberately when the feature can encounter them.
- Before finishing coding work, run the practical proof that fits the change. For most Slopularity edits, `npm run lint` and `npm run build` are enough. Add a light browser smoke check only when the change affects routing, responsive layout, asset loading, or a visibly risky UI path. Do not exhaustively click every interaction unless the user explicitly asks for deep QA or the change directly touches those interactions.

## Skills And Plugins

- Before starting substantial work, check whether a listed Codex skill or plugin applies and use it as the operating playbook, not as decoration.
- For any website, app, prototype, demo, game UI, landing page, or visually important frontend work, always use `frontend-skill` as the art-direction and interaction-quality baseline.
- Claude should default to its frontend design skill for any visual or interaction work in this repository, even for small UI changes, so design judgment is active from the start instead of treated as late polish.
- Pair `frontend-skill` with Build Web Apps for frontend implementation, responsive layout, and local Vite workflows. Treat Build Web Apps as the default plugin lane for this repository's web product work.
- Use Superpowers process skills as the default execution layer for substantial work: planning, test-first implementation when practical, systematic debugging, verification, and finishing a branch.
- Do not use Browser Use for testing, browser inspection, responsive QA, or local Vite smoke checks unless the user explicitly asks for Browser Use or asks you to open/inspect something in the in-app browser. Prefer `npm run lint`, `npm run build`, and non-browser local checks by default.
- Use Game Studio skills for browser games, playable simulations, Phaser, Three.js, asset pipelines, and playtesting.
- Use GitHub skills or tooling for issues, pull requests, CI, publishing, branch cleanup, commits, and pushes.
- Use Documents, Presentations, Spreadsheets, Life Science Research, Build iOS Apps, Build macOS Apps, Gmail, or Vercel only when the task actually touches those domains.
- If a requested plugin or skill is unavailable, say so briefly, choose the closest practical fallback, and keep moving.

## Root Page Rules

- The root page should connect to subprojects without changing the subprojects themselves.
- When adding a new published subproject, add a link for its static `dist/` page on the root page.
- Keep Vite build output committed for published experiments so GitHub Pages can serve the linked pages.
- If a folder does not have a page yet, mark it clearly instead of pretending it is live.
- Preserve relative links so GitHub Pages works from the repository root.

## Demo Quality

- Treat every project as a demo, but never as disposable. Each one should feel polished, well fleshed out, and built with care.
- Make the core interaction complete enough that a real visitor can understand the idea, use it, and see why it is interesting without reading extra explanation.
- For websites and browser apps, design, implement, and verify both desktop web pages and phone-sized experiences before calling the work done.
- Websites must look great on computer and phone: responsive layout, readable text, no awkward overflow, no broken spacing, and no important controls hidden off-screen.
- Websites must be fully interactable on computer and phone: mouse, keyboard where relevant, touch targets, scrolling, forms, buttons, menus, gestures, and game controls should work in the appropriate viewport.
- When practical and relevant, do one quick responsive smoke check for desktop or phone-sized layout, then record that validation in `HISTORY.md`. Avoid broad interaction sweeps by default; compile/build correctness and the specific changed path are the normal bar.

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
- Avoid creating branches by default. Work on the current branch unless the user explicitly asks for a branch or isolation is clearly necessary for risky work.
- When merging or pulling, be careful and deliberate: inspect incoming changes, preserve unrelated work, resolve straightforward conflicts directly, and keep `main` current without turning branch management into the task.
- Whenever making repository changes, commit and push them before calling the task done.
- If pushing requires resolving conflicts, resolve straightforward conflicts directly and continue.
- If a conflict is not obvious to solve, stop and explain the conflicting files, the competing changes, and the decision needed from the user.
- Avoid giant end-of-session commits when multiple logical changes occurred.

## Codex Subagent Acceleration

- This section applies to Codex only. Other agents should follow their own tooling, model, and delegation rules unless the user explicitly tells them to use Codex-style subagents.
- Codex should treat subagents as a default speed tool, not a last resort.
- Codex can have 6 subagents running in parallel at a time in this environment; if more are needed, queue the next wave after one finishes or closes.
- Codex should strongly prefer `gpt-5.3-codex-spark` for easy, well-bounded subagent work. It is super fast, but not especially smart, so give it very explicit instructions, tight file boundaries, and exact output expectations, then have the main Codex agent review, test, and integrate its work before treating it as done.
- Codex should use `gpt-5.4` with `reasoning_effort: low` for medium-complexity support work when Spark is too weak for the task. It is a little smarter, but still not the brightest and is noticeably slower, so prefer Spark whenever the task can be made explicit enough.
- For every actionable task, Codex should actively look for parallel work that can be delegated immediately: codebase exploration, independent implementation slices, research, verification, design critique, test review, risk hunting, or cleanup.
- Codex should keep subagents working constantly whenever there is any useful independent thread of work; prefer one primary local path plus parallel support over a single-agent bottleneck.
- Codex should use multiple subagents when the task has separable surfaces, such as different subprojects, UI and data logic, implementation and testing, or build debugging and product polish.
- For image generation work, Codex should exclusively delegate generation to subagents. The main agent should write direction, review results, and integrate assets, but must not generate images directly.
- Image-generation subagents must use `gpt-5.4` with `reasoning_effort: low`. Do not assign image generation or the `imagegen` skill to `gpt-5.3-codex-spark`; Spark cannot use image generation in this environment.
- When Codex directs image-generation subagents, specify `transparent background` when the asset should have no backdrop; the image generator can return transparent-background images when explicitly asked.
- Codex should give each subagent concrete ownership, clear output expectations, and file boundaries when editing is involved.
- Codex should integrate subagent results itself so the final outcome feels cohesive, fast, and finished.

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
