export type MessageType =
  | "sensor_data"
  | "motor_position"
  | "titration_status"
  | "titration_data_point"
  | "endpoint_detected"
  | "error"
  | "command";

export interface WsMessage {
  type: MessageType;
  payload: Record<string, unknown>;
  timestamp: string;
}
