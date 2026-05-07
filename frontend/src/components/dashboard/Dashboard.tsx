import { cardStyle, colors } from "../../styles/theme";
import type { SensorReading } from "../../types/sensor";

interface DashboardProps {
  latest: SensorReading | null;
  positionCm: number;
  titrationState: string;
  onEmergencyStop: () => void;
}

export function Dashboard({ latest, positionCm, titrationState, onEmergencyStop }: DashboardProps) {
  return (
    <div>
      <h2 style={{ margin: "0 0 16px", color: colors.text }}>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Distance</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.primary }}>
            {latest ? `${latest.distance_cm.toFixed(1)}` : "--"} <span style={{ fontSize: 14 }}>cm</span>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Temperature</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.success }}>
            {latest ? `${latest.temperature_c.toFixed(1)}` : "--"} <span style={{ fontSize: 14 }}>°C</span>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Motor Position</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.text }}>
            {positionCm.toFixed(1)} <span style={{ fontSize: 14 }}>cm</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Titration State</div>
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
            EMERGENCY STOP
          </button>
        </div>
      </div>
    </div>
  );
}
