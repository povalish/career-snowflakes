import { cva } from "class-variance-authority";

//
//

export const header = cva(`
  flex items-center justify-between gap-3
`);

export const heading = cva(`
  text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase
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

export const removeButton = cva(`
  text-muted-foreground hover:bg-destructive/10 hover:text-destructive
`);

export const errorMessage = cva("text-sm text-destructive");
