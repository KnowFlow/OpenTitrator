import client from "./client";
import type { TitrationConfig, TitrationStatus } from "../types/titration";

export async function startTitration(config: TitrationConfig): Promise<{ state: string }> {
  const { data } = await client.post("/titration/start", config);
  return data;
}

export async function stopTitration(): Promise<{ state: string }> {
  const { data } = await client.post("/titration/stop");
  return data;
}

export async function getTitrationStatus(): Promise<TitrationStatus> {
  const { data } = await client.get("/titration/status");
  return data;
}
