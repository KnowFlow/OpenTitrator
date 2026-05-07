import { useEffect, useState } from "react";
import { cardStyle, colors } from "../../styles/theme";
import client from "../../api/client";

interface AppConfig {
  hardware_mode: string;
  sensor_read_interval: number;
  distance_min: number;
  distance_max: number;
  position_tolerance: number;
}

export function SettingsPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    client.get("/config").then(({ data }) => setConfig(data));
  }, []);

  if (!config) return <div style={{ color: colors.textSecondary }}>Loading...</div>;

  return (
    <div>
      <h2 style={{ margin: "0 0 16px", color: colors.text }}>Settings</h2>
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, color: colors.textSecondary }}>System Configuration</h3>
        {Object.entries(config).map(([key, value]) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
            <span style={{ color: colors.text, fontSize: 14 }}>{key}</span>
            <span style={{ color: colors.primary, fontWeight: 600, fontSize: 14 }}>{String(value)}</span>
          </div>
        ))}
      </div>
      <div style={{ ...cardStyle, marginTop: 16 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 14, color: colors.textSecondary }}>Environment Variables</h3>
        <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
          Override settings with <code style={{ background: colors.border, padding: "2px 6px", borderRadius: 4 }}>OT_</code> prefix environment variables.
          For example: <code style={{ background: colors.border, padding: "2px 6px", borderRadius: 4 }}>OT_HARDWARE_MODE=real</code> to switch to real hardware mode.
        </p>
      </div>
    </div>
  );
}
