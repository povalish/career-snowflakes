import { cva } from "class-variance-authority";

//
//

export const backdrop = cva(`
  fixed inset-0 z-40 bg-black/45 opacity-100
  transition-opacity duration-200
  data-closed:opacity-0 data-ending-style:opacity-0 data-starting-style:opacity-0
  motion-reduce:transition-none
`);

export const popup = cva(`
  fixed inset-y-0 right-0 z-50
  flex w-full max-w-120 translate-x-0 flex-col overflow-y-auto
  border-l border-border bg-card px-5 py-6 text-card-foreground shadow-2xl outline-none
  transition-transform duration-200
  data-closed:translate-x-full
  data-ending-style:translate-x-full data-starting-style:translate-x-full
  sm:px-7 motion-reduce:transition-none
`);

export const closeButton = cva(`
  absolute top-4 right-4
  grid size-8 cursor-pointer place-items-center rounded-md
  text-muted-foreground outline-none
  hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring
`);

export const icon = cva("size-4");

export const groupLabel = cva(`
  mb-2 flex items-center gap-2
  text-[10px] font-semibold tracking-wider text-(--track-color)
`);

export const groupMarker = cva(`
  size-1.5 shrink-0 rounded-full bg-(--track-color)
`);

export const titleRow = cva(`
  flex items-start justify-between gap-4
`);

export const title = cva(`
  text-[22px] leading-tight font-medium tracking-tight wrap-anywhere
`);

export const progressValue = cva(`
  shrink-0 text-2xl text-(--track-color)
`);

export const description = cva(`
  mt-4 mb-5
  text-xs leading-6 whitespace-pre-wrap text-muted-foreground wrap-anywhere
`);

export const errorMessage = cva(`
  mb-5 rounded-lg bg-destructive/10 px-4 py-3
  text-sm text-destructive wrap-anywhere
`);

export const levelList = cva(`
  mb-6 flex gap-1.5 border-b border-border pb-6
`);

export const levelButton = cva(`
  h-9 flex-1 cursor-pointer rounded-md
  border border-border bg-transparent
  text-xs text-muted-foreground outline-none
  data-[completed=true]:bg-[color-mix(in_srgb,var(--track-color)_14%,transparent)]
  data-[completed=true]:text-(--track-color)
  aria-pressed:border-(--track-color) aria-pressed:text-(--track-color)
  aria-pressed:shadow-[0_0_0_1px_var(--track-color)]
  focus-visible:ring-2 focus-visible:ring-ring
`);

export const levelStatus = cva(`
  flex items-center gap-1 rounded-sm px-2 py-1
  bg-[color-mix(in_srgb,var(--track-color)_9%,transparent)]
  text-[10px] text-(--track-color)
`);

export const levelHeader = cva(`
  mb-3 flex items-center justify-between gap-3
`);

export const levelEyebrow = cva(`
  text-[10px] font-semibold tracking-[0.16em] text-muted-foreground
`);

export const smallIcon = cva("size-3");

export const stageTitle = cva(`
  mb-3 text-base font-medium wrap-anywhere
`);

export const stageDescription = cva(`
  text-xs leading-6 whitespace-pre-wrap text-muted-foreground wrap-anywhere
`);

export const exampleHeading = cva(`
  mb-3 text-xs font-medium
`);

export const exampleList = cva("space-y-2");

export const exampleItem = cva(`
  relative pl-4 text-xs leading-6 text-muted-foreground wrap-anywhere
  before:absolute before:top-2.5 before:left-0 before:size-1
  before:rounded-full before:bg-(--track-color) before:content-['']
`);

export const saveButton = cva(`
  flex h-9 w-full cursor-pointer items-center justify-center gap-2
  rounded-lg bg-primary px-3
  text-sm font-medium text-primary-foreground outline-none
  hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring
  disabled:pointer-events-none disabled:opacity-50
`);

export const resetButton = cva(`
  mt-1 inline-flex h-8 cursor-pointer items-center justify-center gap-1.5
  rounded-md px-2.5 text-xs text-muted-foreground outline-none
  hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring
  disabled:pointer-events-none disabled:opacity-50
`);

export const footer = cva(`
  mt-auto pt-8 text-center
`);

export const footerContent = cva(`
  border-t border-border pt-5
`);

export const helperText = cva(`
  mt-2.5 text-[10px] leading-4 text-muted-foreground
`);

export const resetIcon = cva("size-3.5");
