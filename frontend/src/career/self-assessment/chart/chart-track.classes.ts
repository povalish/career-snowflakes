import { cva } from "class-variance-authority";

//
//

export const sector = cva(`
  cursor-pointer fill-muted outline-none
  transition-opacity hover:opacity-80
  data-[completed=true]:fill-(--track-color)
  focus-visible:stroke-foreground focus-visible:stroke-2
`);

export const trackDot = cva("fill-(--track-color)");
