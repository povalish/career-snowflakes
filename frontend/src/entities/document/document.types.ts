export interface Document {
  version: number;
  profile: Profile;
  schema: Schema;
  progress: Record<string, number>;
}

export interface Profile {
  name: string;
  role: string;
}

export interface Schema {
  name: string;
  groups: Group[];
}

export interface Group {
  id: string;
  name: string;
  color: string;
  tracks: Track[];
}

export interface Track {
  id: string;
  name: string;
  description: string;
  levels: Level[];
}

export interface Level {
  name: string;
  description: string;
  examples: string[];
}
