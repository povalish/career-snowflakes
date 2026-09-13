import { cva } from "class-variance-authority";

//
//

export const list = cva(`
  grid gap-4 pt-4.5
  [@media(max-width:700px)]:grid-cols-2
  [@media(max-width:700px)]:gap-x-1.75 [@media(max-width:700px)]:gap-y-4.5
`);

export const groupTitle = cva(`
  mt-0 mr-0 mb-1.25 ml-2.25
  flex items-center gap-1.75
  text-[10px] font-medium text-(--track-color)
`);

export const groupMarker = cva(`
  inline-block size-1.5 shrink-0 rounded-full
  bg-(--track-color)
`);

export const trackList = cva(`
  m-0 list-none p-0
`);
