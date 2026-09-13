import { cva } from "class-variance-authority";

//
//

export const chart = cva(`
  block w-full overflow-visible
`);

export const guideRing = cva(`
  fill-none stroke-border stroke-[0.8]
  [stroke-dasharray:2_5]
`);
