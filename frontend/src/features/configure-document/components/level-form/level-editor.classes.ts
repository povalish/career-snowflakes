import { cva } from "class-variance-authority";

//
//

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

export const errorMessage = cva("text-sm text-destructive");
