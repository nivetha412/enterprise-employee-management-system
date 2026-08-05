import MainLayout           from "../../layouts/MainLayout";
import { EmployeeProvider } from "../../context/EmployeeContext";
import EmpDashHero          from "../../components/employee/EmpDashHero";
import EmpDashKPIRow        from "../../components/employee/EmpDashKPIRow";
import EmpDashQuickActions  from "../../components/employee/EmpDashQuickActions";
import EmpDashProfileCard   from "../../components/employee/EmpDashProfileCard";
import EmpDashAttCard       from "../../components/employee/EmpDashAttCard";
import EmpDashLeaveCard     from "../../components/employee/EmpDashLeaveCard";
import EmpDashActivity      from "../../components/employee/EmpDashActivity";
import EmpDashCalendar      from "../../components/employee/EmpDashCalendar";

export default function EmployeeDashboard() {
  return (
    <EmployeeProvider>
      <MainLayout>
        <EmpDashHero />
        <EmpDashKPIRow />
        <EmpDashQuickActions />

        <div className="emp-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "20px" }}>
          <EmpDashProfileCard />
          <EmpDashAttCard />
          <EmpDashLeaveCard />
        </div>

        <div className="emp-grid-2" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px", marginTop: "20px" }}>
          <EmpDashActivity />
          <EmpDashCalendar />
        </div>
      </MainLayout>
    </EmployeeProvider>
  );
}
