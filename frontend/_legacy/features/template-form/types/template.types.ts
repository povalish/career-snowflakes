export type TemplateGroupColor = "aqua" | "blue" | "purple" | "red" | "green" | "yellow" | "orange";

export interface TemplateLevelFF {
  name: string;
  description: string;
  examplesText: string;
}

export interface TemplateTrackFF {
  trackId: string;
  name: string;
  description: string;
  levels: TemplateLevelFF[];
}

export interface TemplateGroupFF {
  groupId: string;
  name: string;
  color: TemplateGroupColor;
  tracks: TemplateTrackFF[];
}

export interface TemplateFF {
  name: string;
  groups: TemplateGroupFF[];
}

export interface TemplateFormState {
  values: TemplateFF;
  isValid: boolean;
  isDirty: boolean;
}
