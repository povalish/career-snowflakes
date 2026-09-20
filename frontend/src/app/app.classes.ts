import { cva } from "class-variance-authority";

//
//

export const dragRegion = cva(`
  fixed inset-x-0 top-0 z-30 h-4
  [--wails-draggable:drag]
`);
