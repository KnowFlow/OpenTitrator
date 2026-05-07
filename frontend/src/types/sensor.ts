export interface SensorReading {
  distance_cm: number;
  temperature_c: number;
  timestamp: string;
}

export interface SensorHistory {
  readings: SensorReading[];
  count: number;
}
