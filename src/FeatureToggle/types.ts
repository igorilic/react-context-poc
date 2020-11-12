export interface Feature {
  name: string;
  description: string;
  tags: string[];
  constraints: Constraint[];
}

export interface Constraint {
  dataScope: string;
  enabled: boolean;
}
