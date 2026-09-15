import { cva } from "class-variance-authority";

//
//

export const section = cva(`
  px-5 py-6 sm:px-6
`);

export const title = cva(`
  text-xl font-medium tracking-tight
`);

export const description = cva(`
  mt-2 text-sm text-muted-foreground
`);
