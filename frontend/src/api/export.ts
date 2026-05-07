import client from "./client";

export function getExportCsvUrl(experimentId: string): string {
  return `/api/export/csv/${experimentId}`;
}

export function getExportPdfUrl(experimentId: string): string {
  return `/api/export/pdf/${experimentId}`;
}

export async function exportCsv(experimentId: string): Promise<Blob> {
  const { data } = await client.get(getExportCsvUrl(experimentId), { responseType: "blob" });
  return data;
}

export async function exportPdf(experimentId: string): Promise<Blob> {
  const { data } = await client.get(getExportPdfUrl(experimentId), { responseType: "blob" });
  return data;
}
