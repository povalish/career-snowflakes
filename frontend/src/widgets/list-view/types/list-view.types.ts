export interface ListViewTrack {
  id: string;
  index: number;
  name: string;
  progress: number;
  levelCount: number;
}

export interface ListViewGroup {
  id: string;
  name: string;
  color: string;
  tracks: readonly ListViewTrack[];
}
