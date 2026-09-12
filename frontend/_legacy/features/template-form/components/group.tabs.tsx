import type { TemplateGroupColor } from "../types/template.types";

interface IGroupTab {
  id: string;
  label: string;
  color: TemplateGroupColor;
  invalid?: boolean;
}

interface IGroupTabs {
  groups: IGroupTab[];
  selectedGroupId: string;
  onSelect: (groupId: string) => void;
}

export const GroupTabs: React.FC<IGroupTabs> = () => null;
