
import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Dashboard() {

  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);

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

      setEmployeeCount(
        employeesResponse.data.length
      );

      setDepartmentCount(
        departmentsResponse.data.length
      );

      setAttendanceCount(
        attendanceResponse.data.length
      );

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <MainLayout>

      <h1>Dashboard</h1>

      <p>Welcome Back 👋</p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap"
        }}
      >

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            width: "250px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <h3>Total Employees</h3>
          <h1>{employeeCount}</h1>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            width: "250px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <h3>Total Departments</h3>
          <h1>{departmentCount}</h1>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            width: "250px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <h3>Attendance Records</h3>
          <h1>{attendanceCount}</h1>
        </div>

      </div>

      <div
        style={{
          marginTop: "40px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px"
        }}
      >
        <h2>System Overview</h2>

        <p>
          Employee Management System is running successfully.
        </p>

        <ul>
          <li>Total Employees: {employeeCount}</li>
          <li>Total Departments: {departmentCount}</li>
          <li>Total Attendance Records: {attendanceCount}</li>
        </ul>

      </div>

    </MainLayout>
  );
}

export default Dashboard;

