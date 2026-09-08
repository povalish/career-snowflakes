---
name: develop
description: Implement repository changes from an architect plan or the user's specification, including focused tests and verification. Use for feature, bug-fix, or refactoring requests that authorize code changes; do not use for planning, investigation, or review-only requests.
---

# Develop

Implement the requested change carefully and completely.

## Source of truth

1. Read the applicable repository instructions and the user's latest request.
2. Follow a plan supplied by the user. When the user references an architect plan, read it in full before editing. If no path is given, inspect `.agents/architect-plans/` and use a plan only when the intended one is unambiguous; otherwise ask.
3. Without a plan, turn the user's specification into a short execution checklist and implement it directly. Do not create a plan file unless requested.
4. Validate every plan against the current code. The latest user instruction and repository constraints override stale or incompatible plan steps; never skip a step silently. If resolving a conflict requires a material scope, architecture, or behavior choice not settled by the user, ask before editing; otherwise adapt and report the deviation.

## Implementation discipline

- Inspect the relevant code, tests, dependencies, generated-code boundaries, and working-tree state before editing. Preserve unrelated changes.
- Make the smallest cohesive change that fully satisfies the request. Avoid speculative features, adjacent cleanup, and unrelated migrations.
- Give each function one operation and one abstraction level. Keep each file, module, service, and component focused on one cohesive responsibility and one reason to change.
- Split code at real responsibility boundaries, not mechanically. Prefer intention-revealing names, explicit dependencies, short focused functions, and comments that explain why.
- Respect existing public contracts. Regenerate derived artifacts through the repository workflow instead of editing them manually.

## Project architecture

### Go backend

- Under `internal/`, write idiomatic Go and preserve the domain-driven dependency direction: domain types and invariants in `model`, pure calculations in `metrics`, composition in `analytics`, use cases in `app`, and external API or persistence details in `tracker` and `cache`.
- Keep Tracker, storage, HTTP, and Wails types out of the domain. Declare small interfaces at the consumer, inject dependencies when it improves testability, wrap errors with operation context, and keep exported APIs minimal.
- Preserve documented domain invariants such as half-open periods, deterministic metrics and sorting, lazy status-history loading, and cache clone-on-read/write behavior.
- Add focused, usually table-driven tests next to changed Go behavior.

### React frontend

- Apply Feature-Sliced Design incrementally to new or changed code; do not migrate unrelated code. For new cohesive functionality, create the smallest appropriate slice and public API. When changing legacy code, keep the edit surgical instead of relocating unrelated code. Use the dependency direction `app -> pages -> widgets -> features -> entities -> shared` and avoid imports into another slice's internals.
- Separate rendering, state, domain behavior, and Wails/API access. A component handles one UI responsibility; hooks or model code handle state; API adapters isolate external calls; reusable primitives belong in `shared`.
- Keep TypeScript strict and use contracts from `frontend/bindings` instead of duplicating backend shapes. Never hand-edit generated bindings.
- Write colocated Vitest tests as `*.test.ts` or `*.test.tsx` against public behavior, mocking Wails at the API boundary. If Vitest is not configured, do not substitute another runner. An ordinary feature request does not authorize adding test infrastructure; add the minimal setup only when the user or plan includes it, otherwise report the missing setup.

## Verification

- For changed behavior, add or update focused tests; add a regression test for a bug fix when practical.
- Format changed Go files, run the narrowest relevant tests first, then the repository-prescribed Go test command when warranted.
- For frontend changes, run the configured Vitest command when available and `npm run build`.
- Regenerate Wails bindings after exported service or contract changes, then review the generated diff and rebuild the frontend.
- Review the final diff against the request or architect plan. Iterate until relevant checks pass, then report changes, verification, material plan deviations, and any checks that could not run.
