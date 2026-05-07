import { cardStyle, colors } from "../../styles/theme";
import { useLanguage } from "../../i18n/LanguageContext";
import type { SensorReading } from "../../types/sensor";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface SensorPageProps {
  readings: SensorReading[];
  latest: SensorReading | null;
}

export function SensorPage({ readings, latest }: SensorPageProps) {
  const { t } = useLanguage();

  const chartData = readings.map((r, i) => ({
    index: i,
    distance: r.distance_cm,
    temperature: r.temperature_c,
    time: new Date(r.timestamp).toLocaleTimeString(),
  }));

  return (
    <div>
      <h2 style={{ margin: "0 0 16px", color: colors.text }}>{t("sensor_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{t("sensor_current_distance")}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: colors.primary }}>
            {latest ? `${latest.distance_cm.toFixed(2)} cm` : "--"}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{t("sensor_current_temperature")}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: colors.success }}>
            {latest ? `${latest.temperature_c.toFixed(2)} °C` : "--"}
          </div>
        </div>
      </div>
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, color: colors.textSecondary }}>{t("sensor_realtime_chart")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="dist" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="temp" orientation="right" tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="dist" type="monotone" dataKey="distance" stroke={colors.primary} strokeWidth={2} dot={false} name={t("sensor_distance_label")} />
            <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke={colors.success} strokeWidth={2} dot={false} name={t("sensor_temperature_label")} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
