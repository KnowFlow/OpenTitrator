export interface MotorState {
  position_cm: number;
  target_cm: number | null;
  moving: boolean;
}
