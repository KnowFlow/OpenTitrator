import { useState, useEffect } from "react";
import type { WsMessage } from "../types/websocket";
import type { SensorReading } from "../types/sensor";

const MAX_POINTS = 200;

export function useSensorData(lastMessage: WsMessage | null) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [latest, setLatest] = useState<SensorReading | null>(null);

  useEffect(() => {
    if (!lastMessage || lastMessage.type !== "sensor_data") return;
    const p = lastMessage.payload;
    const reading: SensorReading = {
      distance_cm: p.distance_cm as number,
      temperature_c: p.temperature_c as number,
      timestamp: lastMessage.timestamp,
    };
    setLatest(reading);
    setReadings((prev) => [...prev.slice(-(MAX_POINTS - 1)), reading]);
  }, [lastMessage]);

  return { readings, latest };
}
