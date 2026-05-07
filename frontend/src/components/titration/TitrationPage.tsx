import { useState, useCallback } from "react";
import { cardStyle, colors, buttonStyle } from "../../styles/theme";
import type { TitrationConfig, TitrationStep, EndpointResult, TitrationState } from "../../types/titration";
import { startTitration, stopTitration } from "../../api/titration";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Scatter,
} from "recharts";

interface TitrationPageProps {
  state: TitrationState;
  steps: TitrationStep[];
  endpoint: EndpointResult | null;
  currentVolume: number;
  onReset: () => void;
}

const DEFAULT_CONFIG: TitrationConfig = {
  pump_id: "acid",
  step_volume_ml: 0.5,
  max_volume_ml: 50,
  endpoint_threshold: 0.3,
  settling_time_s: 1.0,
};

export function TitrationPage({ state, steps, endpoint, currentVolume, onReset }: TitrationPageProps) {
  const [config, setConfig] = useState<TitrationConfig>({ ...DEFAULT_CONFIG });

  const handleStart = useCallback(async () => {
    await startTitration(config);
  }, [config]);

  const handleStop = useCallback(async () => {
    await stopTitration();
  }, []);

  const updateConfig = useCallback(<K extends keyof TitrationConfig>(key: K, value: TitrationConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const chartData = steps.map((s) => ({ volume: s.volume_ml, reading: s.reading }));
  const endpointPoint = endpoint ? [{ volume: endpoint.volume_ml, reading: endpoint.reading }] : [];

  const stateColor = state === "idle" ? colors.secondary : state === "error" ? colors.danger : state === "endpoint_detected" || state === "complete" ? colors.success : colors.primary;

  return (
    <div>
      <h2 style={{ margin: "0 0 16px", color: colors.text }}>Titration</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 12px", fontSize: 14, color: colors.textSecondary }}>Configuration</h3>
            <label style={{ fontSize: 13, color: colors.textSecondary }}>Pump</label>
            <select
              value={config.pump_id}
              onChange={(e) => updateConfig("pump_id", e.target.value)}
              style={{ width: "100%", padding: 6, borderRadius: 6, border: `1px solid ${colors.border}`, marginBottom: 8 }}
            >
              <option value="acid">Acid</option>
              <option value="alkali">Alkali</option>
              <option value="test">Test</option>
            </select>

            <label style={{ fontSize: 13, color: colors.textSecondary }}>Step Volume (mL)</label>
            <input type="number" step={0.1} min={0.1} value={config.step_volume_ml}
              onChange={(e) => updateConfig("step_volume_ml", parseFloat(e.target.value))}
              style={{ width: "100%", padding: 6, borderRadius: 6, border: `1px solid ${colors.border}`, marginBottom: 8, boxSizing: "border-box" }} />

            <label style={{ fontSize: 13, color: colors.textSecondary }}>Max Volume (mL)</label>
            <input type="number" step={1} min={1} value={config.max_volume_ml}
              onChange={(e) => updateConfig("max_volume_ml", parseFloat(e.target.value))}
              style={{ width: "100%", padding: 6, borderRadius: 6, border: `1px solid ${colors.border}`, marginBottom: 8, boxSizing: "border-box" }} />

            <label style={{ fontSize: 13, color: colors.textSecondary }}>Endpoint Threshold</label>
            <input type="number" step={0.01} min={0.01} value={config.endpoint_threshold}
              onChange={(e) => updateConfig("endpoint_threshold", parseFloat(e.target.value))}
              style={{ width: "100%", padding: 6, borderRadius: 6, border: `1px solid ${colors.border}`, marginBottom: 12, boxSizing: "border-box" }} />

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleStart} disabled={state !== "idle"} style={{ ...buttonStyle("primary"), flex: 1, opacity: state !== "idle" ? 0.5 : 1 }}>
                Start
              </button>
              <button onClick={handleStop} disabled={state === "idle"} style={{ ...buttonStyle("danger"), flex: 1, opacity: state === "idle" ? 0.5 : 1 }}>
                Stop
              </button>
            </div>
            {state !== "idle" && (
              <button onClick={onReset} style={{ ...buttonStyle("secondary"), width: "100%", marginTop: 8 }}>Reset</button>
            )}
          </div>

          <div style={{ ...cardStyle, marginTop: 16 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 14, color: colors.textSecondary }}>Status</h3>
            <div style={{ fontSize: 18, fontWeight: 600, color: stateColor, marginBottom: 8 }}>{state.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>Volume: {currentVolume.toFixed(1)} mL</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>Steps: {steps.length}</div>
          </div>

          {endpoint && (
            <div style={{ ...cardStyle, marginTop: 16, borderLeft: `4px solid ${colors.success}` }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 14, color: colors.success }}>Endpoint Detected</h3>
              <div style={{ fontSize: 13, color: colors.text }}>Volume: {endpoint.volume_ml.toFixed(2)} mL</div>
              <div style={{ fontSize: 13, color: colors.text }}>Reading: {endpoint.reading.toFixed(2)}</div>
              <div style={{ fontSize: 13, color: colors.text }}>1st Deriv: {endpoint.first_deriv.toFixed(4)}</div>
              <div style={{ fontSize: 13, color: colors.text }}>2nd Deriv: {endpoint.second_deriv.toFixed(4)}</div>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, color: colors.textSecondary }}>Titration Curve</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="volume" label={{ value: "Volume (mL)", position: "bottom", fontSize: 12 }} tick={{ fontSize: 10 }} />
              <YAxis label={{ value: "Reading", angle: -90, position: "insideLeft", fontSize: 12 }} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reading" stroke={colors.primary} strokeWidth={2} dot={{ r: 2 }} name="Reading" />
              {endpointPoint.length > 0 && (
                <Scatter data={endpointPoint} fill={colors.danger} name="Endpoint" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
