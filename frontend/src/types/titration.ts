export type TitrationState =
  | "idle"
  | "positioning"
  | "ready"
  | "titrating"
  | "endpoint_detected"
  | "complete"
  | "error";

export interface TitrationConfig {
  pump_id: string;
  step_volume_ml: number;
  max_volume_ml: number;
  endpoint_threshold: number;
  settling_time_s: number;
}

export interface TitrationStep {
  volume_ml: number;
  reading: number;
  timestamp: string;
}

export interface EndpointResult {
  volume_ml: number;
  reading: number;
  first_deriv: number;
  second_deriv: number;
}

export interface TitrationStatus {
  state: TitrationState;
  current_volume: number;
  step_count: number;
  total_steps: number;
}
