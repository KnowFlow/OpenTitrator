import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  activePage: string;
  onNavigate: (page: string) => void;
  hardwareMode: string;
  connected: boolean;
  children: ReactNode;
}

export function Layout({ activePage, onNavigate, hardwareMode, connected, children }: LayoutProps) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header hardwareMode={hardwareMode} connected={connected} />
      <div style={{ display: "flex" }}>
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <main style={{ flex: 1, padding: 24, overflowY: "auto", maxHeight: "calc(100vh - 76px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
