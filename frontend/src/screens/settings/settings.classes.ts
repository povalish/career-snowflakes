import { cva } from "class-variance-authority";

//
//

export const main = cva(`
  relative isolate h-dvh overflow-hidden
  bg-background px-4 text-foreground
  sm:px-6
`);

export const background = cva(`
  pointer-events-none fixed inset-0 -z-10
  bg-[radial-gradient(circle_at_center,var(--color-card)_0%,transparent_68%)]
`);
