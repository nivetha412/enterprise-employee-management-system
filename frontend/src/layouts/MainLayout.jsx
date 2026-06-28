import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar onSidebarToggle={() => setCollapsed(prev => !prev)} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar collapsed={collapsed} />
        <main style={{
          flex: 1,
          padding: "28px 32px",
          background: "var(--bg-main)",
          minHeight: "calc(100vh - var(--navbar-height))",
          overflowX: "hidden",
          transition: "padding 0.25s"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
