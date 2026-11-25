import { cva } from "class-variance-authority";

//
//

export const sidebar = cva(`
  grid min-h-0 min-w-0 gap-3
  md:h-full md:grid-rows-[auto_auto_minmax(0,1fr)_auto] md:overflow-hidden
`);

export const header = cva(`
  flex items-center justify-between gap-3
`);

export const heading = cva(`
  text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase
`);

export const groupList = cva(`
  grid max-h-64 gap-3 overflow-y-auto overscroll-contain p-0.5
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
  md:min-h-0 md:max-h-none md:pr-2
`);

export const count = cva(`
  shrink-0 text-[10px] text-muted-foreground tabular-nums
`);

export const errorHint = cva("sr-only");

export const generalButton = cva(`
  mb-1 flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-3
  text-left text-xs text-muted-foreground outline-none transition-colors
  hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring
  aria-pressed:bg-muted aria-pressed:text-foreground
  aria-pressed:shadow-[inset_2px_0_0_var(--color-primary)]
  data-[invalid=true]:ring-1 data-[invalid=true]:ring-destructive motion-reduce:transition-none
`);

export const generalIcon = cva("size-3.5 shrink-0");
