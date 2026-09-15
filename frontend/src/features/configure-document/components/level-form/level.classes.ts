import { cva } from "class-variance-authority";

//
//

export const section = cva(`
  mt-3 border-t border-border/70 pt-3
`);

export const header = cva(`
  flex flex-wrap items-center justify-between gap-3
`);

export const heading = cva(`
  text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase
`);
