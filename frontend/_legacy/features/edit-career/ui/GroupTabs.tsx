import { getTrackColorClass, type CareerGroup } from "@/entities/career";
import { Button } from "@/shared/ui/button";

interface GroupTabsProps {
  groups: CareerGroup[];
  selectedGroupId: string;
  onSelect: (groupId: string) => void;
}

export function GroupTabs({ groups, selectedGroupId, onSelect }: GroupTabsProps) {
  return (
    <div
      className="mb-[23px] flex flex-wrap items-center gap-2 border-b border-border pb-[23px]"
      aria-label="Выбрать направление"
    >
      {groups.map((group) => (
        <Button
          key={group.id}
          type="button"
          variant={group.id === selectedGroupId ? "default" : "outline"}
          className="h-auto min-h-8 max-w-full whitespace-normal [overflow-wrap:anywhere]"
          aria-pressed={group.id === selectedGroupId}
          onClick={() => onSelect(group.id)}
        >
          <span
            className={`inline-block size-[6px] shrink-0 rounded-full bg-[var(--track-color)] ${getTrackColorClass(group.color)}`}
          />
          {group.name || "Без названия"}
        </Button>
      ))}
    </div>
  );
}
