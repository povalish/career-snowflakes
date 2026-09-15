import { cva } from "class-variance-authority";

//
//

export const field = cva(`
  mt-7 grid max-w-xl gap-2
`);

export const label = cva("text-xs text-muted-foreground");

export const input = cva(`
  h-10 w-full min-w-0 rounded-md border border-input/60 bg-background/30 px-3 py-1
  text-sm outline-none transition-[border-color,box-shadow]
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive disabled:opacity-50 motion-reduce:transition-none
`);

export const errorMessage = cva("text-sm text-destructive");
