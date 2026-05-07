import client from "./client";
import type { SensorReading } from "../types/sensor";

export async function getLatestReading(): Promise<SensorReading> {
  const { data } = await client.get("/sensor/latest");
  return data;
}
