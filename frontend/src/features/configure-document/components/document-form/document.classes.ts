import { cva } from "class-variance-authority";

//
//

export const form = cva(`
  w-full max-w-5xl
  rounded-xl border border-border bg-card p-6 shadow-xl
  sm:p-8
`);

export const header = cva(`
  flex flex-col gap-4
  sm:flex-row sm:items-center sm:justify-between
`);
