import MainLayout from "../../layouts/MainLayout";
import EmpWelcomeBanner      from "../../components/employee/EmpWelcomeBanner";
import EmpProfileSummary     from "../../components/employee/EmpProfileSummary";
import EmpAttendanceOverview from "../../components/employee/EmpAttendanceOverview";
import EmpLeaveOverview      from "../../components/employee/EmpLeaveOverview";
import EmpQuickActions       from "../../components/employee/EmpQuickActions";
import EmpMyStats            from "../../components/employee/EmpMyStats";
import EmpRecentActivities   from "../../components/employee/EmpRecentActivities";
import EmpUpcomingEvents     from "../../components/employee/EmpUpcomingEvents";
import EmpAnnouncements      from "../../components/employee/EmpAnnouncements";
import EmpPerformanceSummary from "../../components/employee/EmpPerformanceSummary";
import { EmployeeProvider }  from "../../context/EmployeeContext";

const row = (cols, extra = {}) => ({
  display: "grid",
  gridTemplateColumns: cols,
  gap: "16px",
  marginTop: "16px",
  alignItems: "start",
  ...extra,
});

export default function EmployeeDashboard() {
  return (
    <EmployeeProvider>
      <MainLayout>

        <EmpWelcomeBanner />
        <EmpQuickActions />

        <div className="emp-grid-3" style={row("repeat(3, 1fr)")}>
          <EmpProfileSummary />
          <EmpAttendanceOverview />
          <EmpLeaveOverview />
        </div>

        <div className="emp-grid-2" style={row("1fr 1.7fr")}>
          <EmpMyStats />
          <EmpRecentActivities />
        </div>

        <div className="emp-grid-3" style={row("repeat(3, 1fr)", { marginBottom: "8px" })}>
          <EmpUpcomingEvents />
          <EmpAnnouncements />
          <EmpPerformanceSummary />
        </div>

      </MainLayout>
    </EmployeeProvider>
  );
}
