import { cva } from "class-variance-authority";

//
//

export const section = cva(`
  min-w-0 px-4 py-4
  sm:px-5
`);

export const header = cva(`
  flex flex-wrap items-center justify-between gap-3
`);

export const heading = cva(`
  text-[10px] font-semibold tracking-[0.14em] text-(--track-color) uppercase
`);
