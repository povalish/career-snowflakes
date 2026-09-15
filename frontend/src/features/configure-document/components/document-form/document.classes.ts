import { cva } from "class-variance-authority";

//
//

export const form = cva(`
  mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col
`);

export const header = cva(`
  relative z-10 flex shrink-0 items-center justify-end
  border-b border-border/70 pt-20 pb-3
  md:h-20 md:py-0 md:pr-24 md:pl-20
`);

export const screenTitle = cva("sr-only");

export const actions = cva(`
  flex flex-wrap items-center justify-end gap-2
`);

export const status = cva(`
  mr-auto flex items-center gap-1.5 text-[11px] text-muted-foreground
  data-[dirty=true]:text-primary md:mr-1
`);

export const statusIcon = cva("size-3 shrink-0", {
  variants: { busy: { true: "animate-spin motion-reduce:animate-none" } },
});

export const body = cva(`
  min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain border-0 py-3
  scrollbar-none [&::-webkit-scrollbar]:hidden
  md:overflow-hidden
`);

export const submitError = cva(`
  mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2
  text-sm text-destructive
`);
