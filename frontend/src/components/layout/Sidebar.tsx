import { colors } from "../../styles/theme";
import { useLanguage } from "../../i18n/LanguageContext";
import type { TranslationKey } from "../../i18n/translations";

const NAV_ITEMS: { key: string; labelKey: TranslationKey }[] = [
  { key: "dashboard", labelKey: "nav_dashboard" },
  { key: "sensor", labelKey: "nav_sensor" },
  { key: "pump", labelKey: "nav_pumps" },
  { key: "motor", labelKey: "nav_motor" },
  { key: "titration", labelKey: "nav_titration" },
  { key: "experiments", labelKey: "nav_experiments" },
  { key: "settings", labelKey: "nav_settings" },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { t } = useLanguage();

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
          {t(item.labelKey)}
        </button>
      ))}
    </nav>
  );
}
