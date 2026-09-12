import { CircleHelp } from "lucide-react";

import type { CareerDocument, Selection } from "@/entities/career";

import { Snowflake } from "./Snowflake";
import { TrackList } from "./TrackList";

interface CareerOverviewProps {
  document: CareerDocument;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onActivate: (selection: Selection) => void;
}

export function CareerOverview({ document, selection, onSelect, onActivate }: CareerOverviewProps) {
  return (
    <section
      className="overflow-hidden rounded-[12px] border border-border bg-card"
      aria-labelledby="schema-title"
    >
      <div className="flex items-center justify-between gap-[15px] px-[25px] pt-[23px] [@media(max-width:560px)]:px-[18px] [@media(max-width:560px)]:pt-5">
        <div>
          <p className="mb-[5px] flex items-center gap-[7px] text-[9px] font-semibold tracking-[1.6px] text-muted-foreground">
            ОБЗОР
          </p>
          <h2
            id="schema-title"
            className="m-0 text-[17px] font-medium tracking-[-0.3px] [overflow-wrap:anywhere] [@media(max-width:560px)]:text-[15px]"
          >
            {document.schema.name}
          </h2>
        </div>
        <span className="whitespace-nowrap rounded-[6px] border border-border px-[7px] py-1 text-[9px] text-muted-foreground [@media(max-width:560px)]:hidden">
          Направлений: {document.schema.groups.length}
        </span>
      </div>
      <div className="mx-auto grid max-w-[980px] grid-cols-[minmax(0,620px)_minmax(211px,240px)] items-center justify-center gap-[clamp(28px,5vw,72px)] pt-[9px] pr-5 pb-[21px] pl-[6px] min-[1400px]:grid-cols-[minmax(0,1fr)_230px] [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:px-[14px] [@media(max-width:700px)]:pt-0 [@media(max-width:700px)]:pb-5">
        <div className="m-0 w-full min-w-0 max-w-[620px]">
          <Snowflake
            document={document}
            selection={selection}
            onSelect={onSelect}
            onActivate={onActivate}
          />
          <p className="mt-0 mb-2 flex items-center justify-center gap-[6px] text-[10px] text-muted-foreground">
            <CircleHelp size={14} />
            Выбери сектор и нажми его ещё раз, чтобы открыть подробности
          </p>
        </div>
        <TrackList document={document} selection={selection} onSelect={onSelect} />
      </div>
    </section>
  );
}
