import { cva } from "class-variance-authority";

//
//

export const trackButton = cva(`
  flex w-full cursor-pointer items-center gap-1.75
  rounded-sm px-2 py-1.5
  text-[10px] text-muted-foreground outline-none
  hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring
  data-[selected=true]:bg-muted data-[selected=true]:text-foreground
  data-[selected=true]:shadow-[inset_2px_0_0_var(--track-color)]
  min-[1400px]:py-1.75 min-[1400px]:text-[11px]
`);

export const trackCode = cva(`
  text-[8px] opacity-65
`);

export const trackName = cva(`
  flex-1 wrap-anywhere
`);

export const trackProgress = cva(`
  text-(--track-color)
  [font-variant-numeric:tabular-nums]
`);

export const trackLevelCount = cva(`
  text-muted-foreground opacity-60
`);
