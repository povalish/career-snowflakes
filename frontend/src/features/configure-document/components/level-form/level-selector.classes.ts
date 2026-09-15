import { cva } from "class-variance-authority";

//
//

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
