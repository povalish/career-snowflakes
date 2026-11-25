import { cva } from "class-variance-authority";

//
//

export const groupItem = cva(`
  grid min-w-0 gap-1
`);

export const groupButton = cva(`
  flex w-full cursor-pointer items-center gap-2
  rounded-sm px-2 py-2 text-left text-xs font-medium text-(--track-color) outline-none
  hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring
  data-[invalid=true]:ring-1 data-[invalid=true]:ring-destructive
`);

export const colorDot = cva(`
  size-1.5 shrink-0 rounded-full bg-(--track-color)
`);

export const trackButton = cva(`
  flex w-full cursor-pointer items-center gap-2.5
  rounded-sm px-2 py-2 text-left text-xs text-muted-foreground outline-none
  transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring
  aria-pressed:bg-muted aria-pressed:text-foreground
  aria-pressed:shadow-[inset_2px_0_0_var(--track-color)]
  data-[invalid=true]:ring-1 data-[invalid=true]:ring-destructive motion-reduce:transition-none
`);

export const trackCode = cva(`
  w-6 shrink-0 text-[10px] text-(--track-color) opacity-80
`);

export const trackName = cva(`
  min-w-0 flex-1 wrap-anywhere
`);

export const count = cva(`
  shrink-0 text-[10px] text-muted-foreground tabular-nums
`);
