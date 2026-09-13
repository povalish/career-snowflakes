---
name: feature-slice-design
description: Plan the React frontend architecture in this repository using its Feature-Sliced Design layers, slice boundaries, dependencies, segments, and public APIs. Use only for architecture planning; do not use for implementation-only edits, routine refactors, or bug fixes that do not explicitly require architectural planning.
---

# Feature-Sliced Design

Use this skill only to produce architecture decisions or an implementation plan for `frontend/src`.
Do not apply it while implementing changes or fixing bugs.

## Layers and dependencies

The repository uses this dependency direction:

`app -> screens -> widgets -> features -> entities -> shared`

A layer may import only layers to its right. In this repository:

- `app` composes the application, routes, providers, and global styles; it may use every lower layer.
- `screens` contains route-level composition and may use widgets, features, entities, and shared code.
- `widgets` contains large self-contained UI blocks and may use features, entities, and shared code.
- `features` contains user actions and scenarios and may use entities and shared code.
- `entities` contains frontend domain concepts and may use shared code.
- `shared` contains domain-agnostic UI and infrastructure and must not import upper layers.

`frontend/src/main.tsx` is a technical entry point above `app`, not another layer. Follow these rules:

- Keep slices on the same layer independent. If two sibling slices must be coordinated, compose them on a higher layer.
- Import another slice only through its root `index.ts`; do not reach into its internal files or folders.
- Keep each public API minimal. Do not add a barrel file for an entire layer.
- Use `@/` for cross-slice imports and relative paths inside a slice.
- Never import from `frontend/_legacy`.

## Slice structure

Use the repository conventions below. Add only the files and segments required by the planned
responsibility; do not prescribe empty folders.

- `features/<feature-name>/`: optional `components/`, `hooks/`, `constants/`, `types/`, and `utils/`,
  plus the public `index.ts`.
- `entities/<entity-name>/`: keep it flat with the applicable `<name>.entity.ts`, `<name>.schema.ts`,
  `<name>.constants.ts`, and public `index.ts`. Do not duplicate Go-owned behavior or generated Wails
  contracts in frontend schemas or types.
- `screens/<screen-name>/`: keep it flat with `<name>.screen.tsx` and public `index.ts`; a screen is a
  composition point, not a new domain layer.
- `widgets/<widget-name>/`: keep it minimal. When internal segments are justified, use the applicable
  feature terminology rather than inventing another taxonomy.

`app` and `shared` are not business-slice collections. Preserve the established `app/styles/` and
`shared/ui/` structure instead of applying these templates to them.

## Planning output

For every proposed change, name the layer and slice, justify that placement, list the required files or
segments, identify allowed dependencies, and state what the root `index.ts` exports. Prefer the smallest
set of slices that keeps the dependency direction intact, and do not include unrelated migrations.
