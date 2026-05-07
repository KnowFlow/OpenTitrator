import client from "./client";
import type { MotorState } from "../types/motor";

export async function getMotorPosition(): Promise<MotorState> {
  const { data } = await client.get("/motor/position");
  return data;
}

export async function moveTo(targetCm: number): Promise<{ target_cm: number; moving: boolean }> {
  const { data } = await client.post("/motor/move-to", { target_cm: targetCm });
  return data;
}

export async function stopMotor(): Promise<MotorState> {
  const { data } = await client.post("/motor/stop");
  return data;
}
