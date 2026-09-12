interface ITrackOption {
  id: string;
  label: string;
  levelCount: number;
  invalid?: boolean;
}

interface ITrackSelector {
  tracks: ITrackOption[];
  selectedTrackId: string;
  canAdd: boolean;
  onSelect: (trackId: string) => void;
  onAdd: () => void;
}

export const TrackSelector: React.FC<ITrackSelector> = () => null;
