import { cva } from "class-variance-authority";

//
//

export const submitError = cva(`
  mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2
  text-sm text-destructive
`);

export const transferSuccess = cva(`
  mt-4 rounded-md border border-primary/40 bg-primary/10 px-3 py-2
  text-sm text-foreground
`);
