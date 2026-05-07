import type { TitrationStep, EndpointResult } from "./titration";

export interface Experiment {
  id: string;
  name: string;
  created_at: string;
  status: string;
  steps: TitrationStep[];
  endpoint: EndpointResult | null;
  notes: string;
}

export interface ExperimentListItem {
  id: string;
  name: string;
  created_at: string;
  status: string;
  step_count: number;
}
