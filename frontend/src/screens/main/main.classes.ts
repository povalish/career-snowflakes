import { cva } from "class-variance-authority";

//
//

export const main = cva(`
  relative isolate overflow-hidden
  grid min-h-screen place-items-center
  bg-background text-foreground
  px-4 py-8 pl-70
`);

export const background = cva(`
  pointer-events-none absolute inset-0 -z-10
  bg-[radial-gradient(circle_at_center,var(--color-card)_0%,transparent_68%)]
`);

export const content = cva(`
  w-full max-w-7xl
  flex flex-row-reverse items-center justify-center
  mx-auto gap-[clamp(2rem,5vw,4.5rem)] [@media(max-width:700px)]:flex-col
`);

export const chartContainer = cva(`
  min-w-0 w-full max-w-[min(92vw,72vh,46rem)]
`);

export const listContainer = cva(`
  absolute top-8 left-8 bottom-8
`)

export const loadingState = cva(`
  flex items-center gap-2
  text-sm text-muted-foreground
`);

export const loadingIcon = cva(`
  size-4 shrink-0 animate-spin
  motion-reduce:animate-none
`);

export const loadError = cva(`
  max-w-md text-center text-sm text-destructive
`);

export const bottomAccent = cva(`
  absolute bottom-0 h-1 w-1/2
  rounded-tl-2xl rounded-tr-2xl bg-primary
`);
