import { cva } from "class-variance-authority";

//
//

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
