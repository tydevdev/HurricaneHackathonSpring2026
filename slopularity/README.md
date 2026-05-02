# Slopularity

Working title for the real Hurricane Hackathon Spring 2026 project.

## Premise

It is 2030. AI won. Every app, dashboard, social feed, marketplace, assistant, workflow, inbox, document editor, file system, calendar, and search engine has been merged into one glowing super app.

The app presents itself like the singularity of the web: one place for everything, every task predicted, every answer generated, every interface personalized before the user asks.

The joke is that it is AI-made slop. It looks powerful, expensive, and inevitable, but the more the user interacts with it, the more it reveals that nobody checked what was generated. Surfaces contradict each other. Buttons clone themselves. Trust signals become placeholders. The assistant overpromises. Data leaks into copy. Layouts drift. The product does not explode immediately; it decays through use.

## Current State

This folder is intentionally not implemented yet. It exists so future work has a real home and a durable product direction.

The earlier projects in this repository were tests, studies, or prototypes. `quiet-collapse/` is the closest reference for the slow-failure mechanic, while `slopternet/` is a louder reference for obvious AI slop. `slopularity/` should become the main build.

`PLAN.md` is the living idea tracker for the project.

## Product Shape

The first implemented version should feel like a complete app, not a landing page. A visitor should be dropped directly into the 2030 super app surface and be able to poke at meaningful areas:

- universal search
- AI assistant
- social feed
- tasks or productivity
- wallet or commerce
- identity/profile
- files or memory
- automation/control center

The degradation should be stateful and interaction-driven. The user should cause the collapse by using the product normally.

## Tone

Keep the satire sharp but not random. The app should be funny because it is specific:

- generated copy that sounds useful until it disagrees with itself
- fake integrations that expose internal scaffolding
- confident assistant answers with missing sources
- dashboards that optimize nonsense
- privacy promises contradicted by leaked context
- personalization that becomes invasive, then incoherent
- recovery tools that are also generated and unreliable

Avoid visible meta-copy that says the project is clever, beautiful, intentional, premium, or satirical. Let the interface prove it.

## Implementation Guardrails

- Do not scaffold code here until the user asks to implement.
- When implementation begins, use a local project structure that can build cleanly for GitHub Pages.
- Prefer a responsive browser app with desktop and phone QA.
- Record significant work in the root `HISTORY.md`.
- Keep root links honest: only link `slopularity/dist/` from the root page after a real build exists.
