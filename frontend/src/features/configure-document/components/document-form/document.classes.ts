import { cva } from "class-variance-authority";

//
//

export const form = cva(`
  w-full max-w-5xl
  rounded-xl border border-border bg-card p-6 shadow-xl
  sm:p-8
`);

export const header = cva(`
  flex flex-col gap-4
  sm:flex-row sm:items-center sm:justify-between
`);

export const field = cva(`
  mt-6 grid gap-2
`);

export const input = cva(`
  flex h-9 w-full min-w-0
  rounded-md border border-input bg-transparent px-3 py-1 shadow-xs
  text-base outline-none transition-[color,box-shadow]
  placeholder:text-muted-foreground
  focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
  aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
  md:text-sm
`);

export const errorMessage = cva("text-sm text-destructive");

export const submitError = cva(`
  mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2
  text-sm text-destructive
`);
