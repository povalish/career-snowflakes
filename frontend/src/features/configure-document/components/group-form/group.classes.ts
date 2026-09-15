import { cva } from "class-variance-authority";

//
//

export const workspace = cva(`
  grid min-h-0 min-w-0 items-start gap-6
  md:h-full md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]
`);

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

export const editor = cva(`
  min-h-0 min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
  md:h-full md:overflow-y-auto md:overscroll-contain
  motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150
`);

export const section = cva(`
  border-b border-border/70 bg-background/20 px-4 py-3
  sm:px-5
`);

export const fields = cva(`
  mt-2 grid min-w-0 gap-3
  min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:items-end
`);

export const field = cva(`
  grid min-w-0 gap-2 border-0 p-0
`);

export const label = cva(`
  mb-1 text-xs font-medium text-muted-foreground
`);

export const control = cva(`
  flex h-10 w-full min-w-0
  rounded-md border border-input/60 bg-background/30 px-3 py-1
  text-sm outline-none transition-[border-color,box-shadow]
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive
  disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none
`);

export const palette = cva(`
  flex min-h-10 flex-wrap items-center gap-1.5
`);

export const colorOption = cva(`
  relative grid size-8 shrink-0 cursor-pointer place-items-center
`);

export const colorInput = cva(`
  peer absolute inset-0 size-full cursor-pointer appearance-none
  rounded-full border-4 border-transparent bg-(--track-color) bg-clip-padding outline-none
  transition-shadow hover:ring-1 hover:ring-(--track-color)/50
  checked:ring-1 checked:ring-(--track-color)
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card
  disabled:cursor-not-allowed motion-reduce:transition-none
`);

export const colorCheck = cva(`
  pointer-events-none relative invisible text-background
  peer-checked:visible [&_svg]:size-3.5 [&_svg]:stroke-3
`);

export const removeButton = cva(`
  text-muted-foreground hover:bg-destructive/10 hover:text-destructive
`);

export const errorMessage = cva("text-sm text-destructive");

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
