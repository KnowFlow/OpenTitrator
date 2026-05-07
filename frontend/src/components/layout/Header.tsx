import { colors, cardStyle } from "../../styles/theme";
import { useLanguage } from "../../i18n/LanguageContext";

interface HeaderProps {
  hardwareMode: string;
  connected: boolean;
}

export function Header({ hardwareMode, connected }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <header style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 20, color: colors.text }}>OpenTitrator</h1>
        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: colors.warning, color: "#fff" }}>
          {hardwareMode.toUpperCase()}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setLang(lang === "en" ? "zh" : "en")}
          style={{
            padding: "4px 10px",
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            background: colors.surface,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: colors.text,
          }}
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? colors.success : colors.danger }} />
          <span style={{ fontSize: 13, color: colors.textSecondary }}>
            {connected ? t("connected") : t("disconnected")}
          </span>
        </div>
      </div>
    </header>
  );
}
