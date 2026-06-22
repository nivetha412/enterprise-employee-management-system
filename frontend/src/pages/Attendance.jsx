import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Attendance() {

  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {

    fetchAttendance();
    fetchEmployees();

  }, []);

  const fetchAttendance = async () => {

    try {

      const response =
        await api.get("/attendance");

      setAttendanceList(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const fetchEmployees = async () => {

    try {

      const response =
        await api.get("/employees");

      setEmployees(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const checkIn = async () => {

    if (!employeeId) {
      alert("Select Employee");
      return;
    }

    try {

      await api.post(
        "/attendance/checkin",
        {
          employeeId: Number(employeeId)
        }
      );

      fetchAttendance();

    } catch (error) {

      console.error(error);

    }

  };

  const checkOut = async () => {

    if (!employeeId) {
      alert("Select Employee");
      return;
    }

    try {

      await api.post(
        "/attendance/checkout",
        {
          employeeId: Number(employeeId)
        }
      );

      fetchAttendance();

    } catch (error) {

      console.error(error);

    }

  };

  const deleteAttendance = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete Attendance Record?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

    await api.delete(
  `/attendance/${id}`);

      fetchAttendance();

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <MainLayout>

      <h1>Attendance Management</h1>

      <br />

      <select
        value={employeeId}
        onChange={(e) =>
          setEmployeeId(e.target.value)
        }
      >

        <option value="">
          Select Employee
        </option>

        {
          employees.map((employee) => (

            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.firstName}
            </option>

          ))
        }

      </select>

      <br />
      <br />

      <button onClick={checkIn}>
        Check In
      </button>

      <button
        onClick={checkOut}
        style={{
          marginLeft: "10px"
        }}
      >
        Check Out
      </button>

      <br />
      <br />

      <table
        border="1"
        cellPadding="10"
      >

        <thead>

          <tr>

            <th>ID</th>

            <th>Employee ID</th>

            <th>Date</th>

            <th>Check In</th>

            <th>Check Out</th>

            <th>Status</th>

            <th>Working Hours</th>

            <th>Late Arrival</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {
            attendanceList.map((attendance) => (

              <tr key={attendance.id}>

                <td>{attendance.id}</td>

                <td>{attendance.employeeId}</td>

                <td>{attendance.attendanceDate}</td>

                <td>{attendance.checkInTime}</td>

                <td>{attendance.checkOutTime}</td>

                <td>{attendance.status}</td>

                <td>{attendance.workingHours}</td>

                <td>
                  {
                    attendance.lateArrival
                      ? "Yes"
                      : "No"
                  }
                </td>

                <td>

                  <button
                    onClick={() =>
                      deleteAttendance(
                        attendance.id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))
          }

        </tbody>

      </table>

    </MainLayout>

  );
}

export default Attendance;

