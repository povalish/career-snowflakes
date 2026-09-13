---
name: tailwind-style-guide
description: Apply this repository's Tailwind CSS class placement and grouping conventions when writing, refactoring, or reviewing React components under frontend/src. Use when work adds or changes className values or organizes Tailwind classes; do not use for changes that leave component styling untouched.
---

# Tailwind Style Guide

Use these conventions for Tailwind classes in `frontend/src`. Preserve the rendered styles and behavior
when extracting existing classes.

## Keep only simple styles inline

Keep a string literal in `className` only when all of the following are true:

- It contains no more than three Tailwind utilities.
- It only controls text color, font size, margin, or padding.
- The value is easier to understand beside the markup than behind a semantic name.

For SVG text, a `fill-*` utility counts as text color. Count each responsive, state, or data-prefixed
utility separately.

Acceptable inline examples:

```tsx
<header className="pr-10" />
<span className="text-xs text-muted-foreground" />
<div className="mt-6" />
<text className="text-[10px] fill-muted-foreground" />
```

Extract everything else, including short sets that control layout, positioning, element dimensions,
borders, backgrounds, effects, transitions, interaction states, or responsive behavior. For example,
extract `block w-full overflow-visible` and `size-4`.

A dynamic class expression that only supplies a runtime theme or text color, such as
`className={colorClass}`, may remain in the component.

## Use colocated CVA definitions

Put extracted classes in a `<component-name>.classes.ts` file beside the component. Do not create shared
style modules solely to deduplicate a small class set.

- Import `cva` from `class-variance-authority`.
- Export a named `cva()` definition with a semantic element or role name.
- Call the definition at the JSX site: `className={trackButton()}`.
- Compose an additional dynamic class through CVA's `className` input:
  `className={popup({ className: colorClass })}`.
- Use CVA variants only when the class selection itself depends on a component variant. Prefer existing
  `data-*`, ARIA, responsive, and state modifiers when extraction alone is sufficient.

Use a compact definition for one utility:

```ts
export const icon = cva("size-4");
```

Use a template literal for multiple utilities and group lines by related CSS concerns. Keep groups in a
readable order such as positioning, layout and dimensions, spacing and decoration, typography, then
states and responsive modifiers:

```ts
export const trackButton = cva(`
  flex w-full cursor-pointer items-center gap-2
  rounded-md px-3 py-2
  text-sm text-muted-foreground outline-none
  hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring
  disabled:pointer-events-none disabled:opacity-50
`);
```

Do not reorder utilities in a way that changes which conflicting Tailwind rule wins.

## Review and verification

After editing, audit remaining inline literals with:

```bash
rg -n --glob '*.tsx' 'className="' frontend/src
```

Confirm each result satisfies the inline rule. Then run the repository frontend checks from `frontend/`:

```bash
pnpm check
```
