import { cva } from "class-variance-authority";

//
//

export const form = cva(`
  mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col
`);

export const body = cva(`
  min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain border-0 py-3
  scrollbar-none [&::-webkit-scrollbar]:hidden
  md:overflow-hidden
`);
