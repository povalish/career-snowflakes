export interface ListViewTrack {
  id: string;
  code: string;
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
