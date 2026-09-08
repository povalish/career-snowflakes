---
name: architect
description: Analyze a repository task and its existing code, then write an actionable implementation plan under .agents/architect-plans without implementing the change. Use for architecture, investigation, scoping, or plan-first requests.
---

# Architect

Turn a requested change into a concise, evidence-based implementation plan.

## Workflow

1. Read the applicable repository instructions and the user's request.
2. Inspect the relevant code, tests, dependencies, configuration, and generated-code boundaries. Trace the current behavior far enough to identify real change points; do not invent files or APIs.
3. State reasonable assumptions. Ask a question only when an unresolved choice would materially change the scope or architecture.
4. Write one self-contained plan to `.agents/architect-plans/`.
5. Return the plan path and a brief summary, then stop. Do not edit product code, generated files, or configuration unless the user separately asks to implement the plan.

## Plan file

- Name it `DD-MMM-HH-mm.<feature-slug>.md` using local time, an English month abbreviation, and a lowercase 2-3 word kebab-case feature slug. Example: `24-Aug-17-35.rate-limit-retry.md`.
- Use `HH-mm` instead of `HH:mm` because Windows filenames cannot contain `:`.
- When refining the same task, update its existing plan. Never overwrite a plan for a different task.
- Include the goal, relevant current behavior with exact file and symbol references, ordered implementation steps, and verification commands or tests. Add assumptions, risks, or open questions only when they affect execution.
- Make each step actionable: identify what changes, where it changes, why it is needed, and any ordering dependency. Do not include implementation code.
