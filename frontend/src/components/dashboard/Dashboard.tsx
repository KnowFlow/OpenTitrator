import { cardStyle, colors } from "../../styles/theme";
import { useLanguage } from "../../i18n/LanguageContext";
import type { SensorReading } from "../../types/sensor";

interface DashboardProps {
  latest: SensorReading | null;
  positionCm: number;
  titrationState: string;
  onEmergencyStop: () => void;
}

export function Dashboard({ latest, positionCm, titrationState, onEmergencyStop }: DashboardProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h2 style={{ margin: "0 0 16px", color: colors.text }}>{t("dashboard_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{t("dashboard_distance")}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.primary }}>
            {latest ? `${latest.distance_cm.toFixed(1)}` : "--"} <span style={{ fontSize: 14 }}>{t("dashboard_unit_cm")}</span>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{t("dashboard_temperature")}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.success }}>
            {latest ? `${latest.temperature_c.toFixed(1)}` : "--"} <span style={{ fontSize: 14 }}>{t("dashboard_unit_celsius")}</span>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{t("dashboard_motor_position")}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.text }}>
            {positionCm.toFixed(1)} <span style={{ fontSize: 14 }}>{t("dashboard_unit_cm")}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{t("dashboard_titration_state")}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: titrationState === "idle" ? colors.secondary : colors.primary }}>
            {titrationState.toUpperCase()}
          </div>
        </div>
        <div style={cardStyle}>
          <button
            onClick={onEmergencyStop}
            style={{
              width: "100%",
              padding: 16,
              border: "none",
              borderRadius: 8,
              background: colors.danger,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t("dashboard_emergency_stop")}
          </button>
        </div>
      </div>
    </div>
  );
}
