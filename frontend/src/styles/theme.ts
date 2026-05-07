export const colors = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  secondary: "#64748b",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
  textSecondary: "#64748b",
};

export const cardStyle: React.CSSProperties = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

export const buttonStyle = (
  variant: "primary" | "danger" | "secondary" = "primary"
): React.CSSProperties => ({
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  background: variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : colors.secondary,
  color: "#fff",
});
