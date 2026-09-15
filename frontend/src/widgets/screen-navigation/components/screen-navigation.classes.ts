import { cva } from "class-variance-authority";

//
//

export const navigation = cva(`
  fixed top-5 right-4 z-20 flex items-center gap-1
  rounded-lg border border-border/70 bg-card/90 p-1 backdrop-blur-sm
  sm:right-6
`);

export const navigationLink = cva(`
  grid size-7 place-items-center rounded-md
  text-muted-foreground outline-none transition-colors
  hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring
  aria-[current=page]:bg-muted aria-[current=page]:text-primary
  motion-reduce:transition-none
`);

export const icon = cva("size-3.5");
