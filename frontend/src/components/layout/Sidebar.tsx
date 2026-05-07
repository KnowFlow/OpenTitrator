import { colors } from "../../styles/theme";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "sensor", label: "Sensor" },
  { key: "pump", label: "Pumps" },
  { key: "motor", label: "Motor" },
  { key: "titration", label: "Titration" },
  { key: "experiments", label: "Experiments" },
  { key: "settings", label: "Settings" },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <nav style={{ width: 200, minHeight: "calc(100vh - 76px)", background: colors.surface, borderRight: `1px solid ${colors.border}`, padding: "12px 0" }}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px 20px",
            border: "none",
            background: activePage === item.key ? "#eff6ff" : "transparent",
            color: activePage === item.key ? colors.primary : colors.text,
            fontWeight: activePage === item.key ? 600 : 400,
            fontSize: 14,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
