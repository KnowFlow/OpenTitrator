export type PumpType = "acid" | "alkali" | "test";

export interface PumpState {
  pump_type: PumpType;
  angle: number;
  dispensed_ml: number;
}
