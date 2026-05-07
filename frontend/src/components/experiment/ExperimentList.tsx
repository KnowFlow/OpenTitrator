import { useEffect, useState, useCallback } from "react";
import { cardStyle, colors, buttonStyle } from "../../styles/theme";
import { useLanguage } from "../../i18n/LanguageContext";
import type { ExperimentListItem } from "../../types/experiment";
import { listExperiments, deleteExperiment } from "../../api/experiment";
import { getExportCsvUrl, getExportPdfUrl } from "../../api/export";

export function ExperimentList() {
  const [experiments, setExperiments] = useState<ExperimentListItem[]>([]);
  const { t } = useLanguage();

  const fetchExperiments = useCallback(async () => {
    const { experiments: items } = await listExperiments();
    setExperiments(items);
  }, []);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteExperiment(id);
    setExperiments((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: colors.text }}>{t("experiment_title")}</h2>
        <button onClick={fetchExperiments} style={buttonStyle("secondary")}>{t("experiment_refresh")}</button>
      </div>
      {experiments.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ color: colors.textSecondary, textAlign: "center" }}>{t("experiment_empty")}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {experiments.map((exp) => (
            <div key={exp.id} style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, color: colors.text }}>{exp.name || `Experiment ${exp.id}`}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>
                  {new Date(exp.created_at).toLocaleString()} | {exp.status} | {exp.step_count} {t("experiment_readings")}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={getExportCsvUrl(exp.id)} download style={{ ...buttonStyle("primary"), textDecoration: "none", fontSize: 12, padding: "6px 12px" }}>
                  CSV
                </a>
                <a href={getExportPdfUrl(exp.id)} download style={{ ...buttonStyle("primary"), textDecoration: "none", fontSize: 12, padding: "6px 12px" }}>
                  PDF
                </a>
                <button onClick={() => handleDelete(exp.id)} style={{ ...buttonStyle("danger"), fontSize: 12, padding: "6px 12px" }}>
                  {t("experiment_delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
