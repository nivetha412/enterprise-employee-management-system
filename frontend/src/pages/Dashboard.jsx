import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Dashboard() {

  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    try {

      const employeesResponse =
        await api.get("/employees");

      const departmentsResponse =
        await api.get("/departments");

      const attendanceResponse =
        await api.get("/attendance");

      const attendanceData =
        attendanceResponse.data;

      setEmployeeCount(
        employeesResponse.data.length
      );

      setDepartmentCount(
        departmentsResponse.data.length
      );

      setPresentCount(
        attendanceData.filter(
          item =>
            item.status === "PRESENT"
        ).length
      );

      setAbsentCount(
        attendanceData.filter(
          item =>
            item.status === "ABSENT"
        ).length
      );

      setLateCount(
        attendanceData.filter(
          item =>
            item.lateArrival === true
        ).length
      );

    } catch (error) {

      console.error(error);

    }

  };

  const totalAttendance =
    presentCount + absentCount;

  const attendancePercentage =
    totalAttendance > 0
      ? (
          (presentCount /
            totalAttendance) *
          100
        ).toFixed(1)
      : 0;

  const DashboardCard = ({
    title,
    value,
    color
  }) => (

    <div
      style={{
        background: "#ffffff",
        borderRadius: "15px",
        padding: "25px",
        boxShadow:
          "0px 4px 15px rgba(0,0,0,0.08)",
        borderLeft:
          `6px solid ${color}`
      }}
    >

      <h3
        style={{
          margin: 0,
          color: "#666"
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          marginTop: "15px",
          marginBottom: 0,
          color: color
        }}
      >
        {value}
      </h1>

    </div>

  );

  return (

    <MainLayout>

      <div>

        <h1>
          Enterprise Employee
          Management System
        </h1>

        <p
          style={{
            color: "#666"
          }}
        >
          Welcome Back 👋
        </p>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "25px"
        }}
      >

        <DashboardCard
          title="Total Employees"
          value={employeeCount}
          color="#2563eb"
        />

        <DashboardCard
          title="Departments"
          value={departmentCount}
          color="#7c3aed"
        />

        <DashboardCard
          title="Present Today"
          value={presentCount}
          color="#16a34a"
        />

        <DashboardCard
          title="Absent Today"
          value={absentCount}
          color="#dc2626"
        />

        <DashboardCard
          title="Late Arrivals"
          value={lateCount}
          color="#ea580c"
        />

      </div>

      <div
        style={{
          marginTop: "35px",
          background: "#ffffff",
          borderRadius: "15px",
          padding: "25px",
          boxShadow:
            "0px 4px 15px rgba(0,0,0,0.08)"
        }}
      >

        <h2>
          Company Analytics
        </h2>

        <hr />

        <p>
          Attendance Rate :
          <strong>
            {" "}
            {attendancePercentage}%
          </strong>
        </p>

        <p>
          Total Employees :
          <strong>
            {" "}
            {employeeCount}
          </strong>
        </p>

        <p>
          Total Departments :
          <strong>
            {" "}
            {departmentCount}
          </strong>
        </p>

        <p>
          Present Employees :
          <strong>
            {" "}
            {presentCount}
          </strong>
        </p>

        <p>
          Absent Employees :
          <strong>
            {" "}
            {absentCount}
          </strong>
        </p>

        <p>
          Late Arrivals :
          <strong>
            {" "}
            {lateCount}
          </strong>
        </p>

      </div>

    </MainLayout>

  );
}

export default Dashboard;