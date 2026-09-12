interface ILevelTab {
  index: number;
  invalid?: boolean;
}

interface ILevelTabs {
  levels: ILevelTab[];
  selectedLevelIndex: number;
  onSelect: (levelIndex: number) => void;
}

export const LevelTabs: React.FC<ILevelTabs> = () => null;
