import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: "28px 32px",
          background: "var(--bg-main)",
          minHeight: "calc(100vh - var(--navbar-height))",
          overflowX: "hidden"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
