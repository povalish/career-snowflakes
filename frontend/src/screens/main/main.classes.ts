import { cva } from "class-variance-authority";

//
//

export const main = cva(`
  relative isolate overflow-hidden
  grid min-h-screen place-items-center
  bg-background px-4 py-8 text-foreground
  sm:px-8 sm:py-10
`);

export const background = cva(`
  pointer-events-none absolute inset-0 -z-10
  bg-[radial-gradient(circle_at_center,var(--color-card)_0%,transparent_68%)]
`);

export const content = cva(`
  mx-auto grid w-full max-w-7xl
  grid-cols-[minmax(0,46rem)_minmax(13rem,15rem)] items-center justify-center
  gap-[clamp(2rem,5vw,4.5rem)]
  [@media(max-width:700px)]:grid-cols-1
`);

export const chartContainer = cva(`
  w-full max-w-[min(92vw,72vh,46rem)]
`);

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
