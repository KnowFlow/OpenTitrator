import { useState, useCallback } from "react";
import { cardStyle, colors, buttonStyle } from "../../styles/theme";
import { moveTo, stopMotor } from "../../api/motor";

interface MotorPageProps {
  positionCm: number;
  moving: boolean;
}

export function MotorPage({ positionCm, moving }: MotorPageProps) {
  const [target, setTarget] = useState(10.0);

  const handleMove = useCallback(async () => {
    await moveTo(target);
  }, [target]);

  const handleStop = useCallback(async () => {
    await stopMotor();
  }, []);

  const pct = ((positionCm - 2) / (19 - 2)) * 100;

  return (
    <div>
      <h2 style={{ margin: "0 0 16px", color: colors.text }}>Motor Control</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, color: colors.textSecondary }}>Current Position</h3>
          <div style={{ fontSize: 48, fontWeight: 700, textAlign: "center", color: colors.primary, marginBottom: 16 }}>
            {positionCm.toFixed(1)} <span style={{ fontSize: 16 }}>cm</span>
          </div>
          <div style={{ position: "relative", height: 24, background: colors.border, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 4, background: colors.primary, borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
            <span>2 cm</span><span>19 cm</span>
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: moving ? colors.warning : colors.success }}>
            {moving ? "MOVING" : "STOPPED"}
          </div>
        </div>
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, color: colors.textSecondary }}>Move To Position</h3>
          <label style={{ fontSize: 13, color: colors.textSecondary }}>Target (cm)</label>
          <input
            type="number"
            min={2}
            max={19}
            step={0.5}
            value={target}
            onChange={(e) => setTarget(parseFloat(e.target.value) || 10)}
            style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 16, marginBottom: 12, boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleMove} style={{ ...buttonStyle("primary"), flex: 1 }}>Move</button>
            <button onClick={handleStop} style={{ ...buttonStyle("danger"), flex: 1 }}>Stop</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
            {[5, 8, 12, 16].map((pos) => (
              <button
                key={pos}
                onClick={() => { setTarget(pos); moveTo(pos); }}
                style={{ padding: 6, border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.surface, cursor: "pointer", fontSize: 13 }}
              >
                {pos} cm
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
