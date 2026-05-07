import client from "./client";
import type { PumpState, PumpType } from "../types/pump";

export async function setPumpAngle(pumpId: PumpType, angle: number): Promise<PumpState> {
  const { data } = await client.post(`/pump/${pumpId}/angle`, { angle });
  return data;
}

export async function dispensePump(pumpId: PumpType, volumeMl: number): Promise<PumpState> {
  const { data } = await client.post(`/pump/${pumpId}/dispense`, { volume_ml: volumeMl });
  return data;
}

export async function getPumpState(pumpId: PumpType): Promise<PumpState> {
  const { data } = await client.get(`/pump/${pumpId}/state`);
  return data;
}
