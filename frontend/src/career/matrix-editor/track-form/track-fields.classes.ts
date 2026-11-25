import { cva } from "class-variance-authority";

//
//

export const fields = cva(`
  motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-150
  mt-2 grid grid-cols-[4rem_minmax(0,1fr)_auto] items-end gap-3
`);

export const field = cva(`
  grid min-w-0 content-start gap-2
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

export const removeButton = cva(`
  mb-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive
`);

export const errorMessage = cva("text-sm text-destructive");
