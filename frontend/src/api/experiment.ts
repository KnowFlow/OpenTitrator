import client from "./client";
import type { Experiment, ExperimentListItem } from "../types/experiment";

export async function listExperiments(limit = 50): Promise<{ experiments: ExperimentListItem[] }> {
  const { data } = await client.get("/experiment/", { params: { limit } });
  return data;
}

export async function getExperiment(id: string): Promise<Experiment> {
  const { data } = await client.get(`/experiment/${id}`);
  return data;
}

export async function deleteExperiment(id: string): Promise<{ deleted: boolean }> {
  const { data } = await client.delete(`/experiment/${id}`);
  return data;
}
