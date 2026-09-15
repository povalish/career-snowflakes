import { cva } from "class-variance-authority";

//
//

export const section = cva(`
  min-w-0 px-4 py-4
  sm:px-5
`);

export const header = cva(`
  flex flex-wrap items-center justify-between gap-3
`);

export const heading = cva(`
  text-[10px] font-semibold tracking-[0.14em] text-(--track-color) uppercase
`);

export const fields = cva(`
  motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-150
  mt-2 grid grid-cols-[4rem_minmax(0,1fr)_auto] items-end gap-3
`);

export const field = cva(`
  grid min-w-0 content-start gap-2
`);

export const wideField = cva(`
  grid min-w-0 content-start gap-2
  col-span-3
`);

export const label = cva("text-xs text-muted-foreground");

export const control = cva(`
  flex h-9 w-full min-w-0
  rounded-md border border-input/60 bg-background/30 px-3 py-1
  text-sm text-(--track-color) outline-none transition-[border-color,box-shadow]
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive disabled:opacity-50 motion-reduce:transition-none
`);

export const titleInput = cva(`
  h-9 w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1
  text-xl font-medium tracking-tight outline-none
  transition-[border-color,box-shadow] hover:border-input/60
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive disabled:opacity-50
  motion-reduce:transition-none
`);

export const textarea = cva(`
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
  min-h-16 w-full min-w-0 resize-y
  rounded-md border border-input/60 bg-background/30 px-3 py-2.5
  text-sm leading-6 outline-none transition-[border-color,box-shadow]
  placeholder:text-muted-foreground/60
  focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25
  aria-invalid:border-destructive disabled:opacity-50 motion-reduce:transition-none
`);

export const removeButton = cva(`
  mb-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive
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

export const errorMessage = cva("text-sm text-destructive");
