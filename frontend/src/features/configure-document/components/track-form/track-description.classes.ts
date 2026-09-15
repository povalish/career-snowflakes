import { cva } from "class-variance-authority";

//
//

export const wideField = cva(`
  grid min-w-0 content-start gap-2
  col-span-3
`);

export const label = cva("text-xs text-muted-foreground");

export const textarea = cva(`
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
  min-h-16 w-full min-w-0 resize-y
  rounded-md border border-input/60 bg-background/30 px-3 py-2.5
  text-sm leading-6 outline-none transition-[border-color,box-shadow]
  placeholder:text-muted-foreground/60
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive disabled:opacity-50 motion-reduce:transition-none
`);

export const errorMessage = cva("text-sm text-destructive");
