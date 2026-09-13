export interface ChartViewLevel {
  name: string;
  completed: boolean;
}

export interface ChartViewTrack {
  id: string;
  groupId: string;
  name: string;
  color: string;
  levels: readonly ChartViewLevel[];
}
