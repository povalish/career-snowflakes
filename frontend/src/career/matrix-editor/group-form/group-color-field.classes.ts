import { cva } from "class-variance-authority";

//
//

export const field = cva(`
  grid min-w-0 gap-2 border-0 p-0
`);

export const label = cva(`
  mb-1 text-xs font-medium text-muted-foreground
`);

export const palette = cva(`
  flex min-h-10 flex-wrap items-center gap-1.5
`);

export const colorOption = cva(`
  relative grid size-8 shrink-0 cursor-pointer place-items-center
`);

export const colorInput = cva(`
  peer absolute inset-0 size-full cursor-pointer appearance-none
  rounded-full border-4 border-transparent bg-(--track-color) bg-clip-padding outline-none
  transition-shadow hover:ring-1 hover:ring-(--track-color)/50
  checked:ring-1 checked:ring-(--track-color)
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card
  disabled:cursor-not-allowed motion-reduce:transition-none
`);

export const colorCheck = cva(`
  pointer-events-none relative invisible text-background
  peer-checked:visible [&_svg]:size-3.5 [&_svg]:stroke-3
`);

export const errorMessage = cva("text-sm text-destructive");
