import { useState, useCallback } from "react";
import { cardStyle, colors } from "../../styles/theme";
import type { PumpType } from "../../types/pump";
import { setPumpAngle, dispensePump } from "../../api/pump";

const PUMPS: { id: PumpType; label: string; color: string }[] = [
  { id: "acid", label: "Acid Pump", color: colors.danger },
  { id: "alkali", label: "Alkali Pump", color: colors.primary },
  { id: "test", label: "Test Pump", color: colors.success },
];

export function PumpPage() {
  const [angles, setAngles] = useState<Record<string, number>>({ acid: 90, alkali: 90, test: 90 });

  const handleAngleChange = useCallback(async (pumpId: PumpType, angle: number) => {
    setAngles((prev) => ({ ...prev, [pumpId]: angle }));
    await setPumpAngle(pumpId, angle);
  }, []);

  const handleDispense = useCallback(async (pumpId: PumpType) => {
    await dispensePump(pumpId, 0.5);
  }, []);

  return (
    <div>
      <h2 style={{ margin: "0 0 16px", color: colors.text }}>Pump Control</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {PUMPS.map((pump) => (
          <div key={pump.id} style={cardStyle}>
            <h3 style={{ margin: "0 0 12px", color: pump.color, fontSize: 16 }}>{pump.label}</h3>
            <div style={{ fontSize: 48, fontWeight: 700, textAlign: "center", color: colors.text, marginBottom: 12 }}>
              {angles[pump.id]}°
            </div>
            <input
              type="range"
              min={0}
              max={180}
              value={angles[pump.id]}
              onChange={(e) => handleAngleChange(pump.id, parseInt(e.target.value))}
              style={{ width: "100%", marginBottom: 12 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: colors.textSecondary, marginBottom: 12 }}>
              <span>0°</span><span>90°</span><span>180°</span>
            </div>
            <button
              onClick={() => handleDispense(pump.id)}
              style={{
                width: "100%",
                padding: 8,
                border: "none",
                borderRadius: 8,
                background: pump.color,
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Dispense 0.5 mL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
