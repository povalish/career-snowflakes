import { cva } from "class-variance-authority";

//
//

export const section = cva(`
  mt-6 border-t border-border pt-6
`);

export const header = cva(`
  flex flex-wrap items-center justify-between gap-3
`);

export const heading = cva("text-base font-semibold");

export const levelList = cva(`
  mt-4 flex flex-wrap items-center gap-2
`);

export const levelButton = cva(`
  h-auto min-h-8 max-w-full whitespace-normal
  [overflow-wrap:anywhere]
`);

export const levelNumber = cva(`
  flex size-5 shrink-0 items-center justify-center
  rounded-full bg-muted
  text-xs font-semibold
`);

export const fields = cva(`
  mt-6 grid gap-4
`);

export const field = cva(`
  grid min-w-0 gap-2
`);

export const label = cva("text-sm font-medium");

export const control = cva(`
  flex h-9 w-full min-w-0
  rounded-md border border-input bg-transparent px-3 py-1 shadow-xs
  text-base outline-none transition-[color,box-shadow]
  placeholder:text-muted-foreground
  focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
  aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
  md:text-sm
`);

export const textarea = cva(`
  min-h-24 w-full min-w-0 resize-y
  rounded-md border border-input bg-transparent px-3 py-2 shadow-xs
  text-base outline-none transition-[color,box-shadow]
  placeholder:text-muted-foreground
  focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
  aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
  md:text-sm
`);

export const errorMessage = cva("text-sm text-destructive");
