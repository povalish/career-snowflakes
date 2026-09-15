import { cva } from "class-variance-authority";

//
//

export const field = cva(`
  grid min-w-0 content-start gap-2
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

export const resourcesSection = cva(`
  col-span-3 rounded-md border border-border/60 px-3 py-2.5
  open:pb-3
`);

export const resourcesSummary = cva(`
  cursor-pointer rounded-sm text-xs text-muted-foreground outline-none
  hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring
  in-open:mb-3
`);
