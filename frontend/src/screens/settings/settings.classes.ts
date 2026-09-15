import { cva } from "class-variance-authority";

//
//

export const main = cva(`
  relative isolate grid overflow-hidden
  min-h-screen place-items-center
  bg-background px-4 py-8 text-foreground
  sm:px-8 sm:py-10
`);
