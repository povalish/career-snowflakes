import { cva } from "class-variance-authority";

//
//

export const field = cva(`
  grid min-w-0 gap-2
`);

export const label = cva("text-xs text-muted-foreground");

export const textarea = cva(`
  scrollbar-none [&::-webkit-scrollbar]:hidden
  min-h-24 w-full min-w-0 resize-y
  rounded-md border border-input/60 bg-background/30 px-3 py-2 shadow-xs
  text-sm leading-6 outline-none transition-[color,box-shadow]
  placeholder:text-muted-foreground
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
  motion-reduce:transition-none
`);

export const errorMessage = cva("text-sm text-destructive");
