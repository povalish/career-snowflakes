import { cva } from "class-variance-authority";

//
//

export const workspace = cva(`
  grid min-h-0 min-w-0 items-start gap-6
  md:h-full md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]
`);

export const editor = cva(`
  min-h-0 min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
  md:h-full md:overflow-y-auto md:overscroll-contain
  motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150
`);
