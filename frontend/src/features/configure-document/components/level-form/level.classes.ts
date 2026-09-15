import { cva } from "class-variance-authority";

//
//

export const section = cva(`
  mt-3 border-t border-border/70 pt-3
`);

export const header = cva(`
  flex flex-wrap items-center justify-between gap-3
`);

export const heading = cva(`
  text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase
`);

export const levelList = cva(`
  mt-2 grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-1.5
`);

export const levelButton = cva(`
  group grid h-9 min-w-0 cursor-pointer place-items-center
  rounded-md border border-border bg-transparent text-muted-foreground outline-none
  transition-[background-color,border-color,color] hover:bg-muted/60
  aria-pressed:border-(--track-color) aria-pressed:text-(--track-color)
  aria-pressed:bg-[color-mix(in_srgb,var(--track-color)_9%,transparent)]
  aria-pressed:shadow-[0_0_0_1px_var(--track-color)]
  data-[invalid=true]:border-destructive data-[invalid=true]:ring-1 data-[invalid=true]:ring-destructive
  focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none
`);

export const levelNumber = cva(`
  text-xs font-medium tabular-nums
`);

export const levelCaption = cva(`
  mt-3 flex items-center justify-between gap-3
`);

export const levelEyebrow = cva(`
  text-[10px] font-semibold tracking-[0.14em] text-(--track-color) uppercase
`);

export const removeButton = cva(`
  text-muted-foreground hover:bg-destructive/10 hover:text-destructive
`);

export const fields = cva(`
  motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-150
  mt-2 grid gap-3
  min-[900px]:grid-cols-2
`);

export const field = cva(`
  grid min-w-0 gap-2
`);

export const label = cva("text-xs text-muted-foreground");

export const nameField = cva(`
  grid min-w-0 gap-2 min-[900px]:col-span-2
`);

export const control = cva(`
  flex h-9 w-full min-w-0
  rounded-md border border-input/60 bg-background/30 px-3 py-1 shadow-xs
  text-sm leading-6 outline-none transition-[color,box-shadow]
  placeholder:text-muted-foreground
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
  motion-reduce:transition-none
`);

export const textarea = cva(`
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
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
