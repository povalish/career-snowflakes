---
name: react-style-guide
description: Apply this repository's component-level React and TypeScript style when planning, writing, refactoring, or reviewing components under frontend/src. Do not use for non-React work or fixes that leave component structure and style untouched.
---

# React Style Guide

Use the conventions below as the component source of truth. TypeScript, Oxfmt, and Oxlint configuration
takes precedence if an example conflicts with it.

## Component shape

- Give a component one UI responsibility.
- Put imports first and the props interface immediately before the component.
- Name a props interface `I<ComponentName>`.
- Prefer a named, exported arrow component typed as `React.FC<I<ComponentName>>`.
- Use a block body with an explicit JSX return.
- Do not create an empty props interface for a component without props; use `React.FC` directly.
- Preserve a deliberate default export at an application or framework entry point, but do not introduce
  default exports for ordinary components.

Use this canonical component form:

```tsx
import { A } from "foo";
// Other imports

//
//

interface IUserCard {
  name: string;
}

export const UserCard: React.FC<IUserCard> = ({ name }) => {
  return <article>{name}</article>;
};
```

React uses the automatic JSX transform, so do not add a runtime React import merely to render JSX.

## Formatting and imports

Let `frontend/.oxfmtrc.json` define mechanical style: two-space indentation, double quotes, semicolons,
trailing commas, 100-column lines, and LF endings.

- Use `import type` for type-only dependencies.
- Keep the formatter's import groups separated: React, external packages and side effects, `@/` project
  imports, then relative imports.
- Use the `@/` alias across modules and relative imports within the same local module or slice.
- Use Tailwind theme tokens such as `bg-background` and `text-foreground` rather than hard-coded theme
  colors. Use `cn` from `@/shared/ui/lib/utils` when class names need composition.

Keep strict TypeScript and React lint rules intact: do not introduce `any`, unsafe promise handling,
hook-rule violations, incomplete hook dependencies, unstable list keys, or import cycles.
