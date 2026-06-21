import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Employees() {

  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [editingId, setEditingId] =useState(null);

  useEffect(() => {fetchEmployees();}, []);

  const fetchEmployees = async () => {

    try {

      const response =
        await api.get("/employees");

      setEmployees(response.data);

    } catch (error) {

      console.error(error);

    }

  };
  const createEmployee = async () => {

  try {

    await api.post("/employees", {
      firstName,
      lastName,
      email
    });

    setFirstName("");
    setLastName("");
    setEmail("");

    fetchEmployees();

  } catch (error) {

    console.error(error);

  }

};const deleteEmployee = async (id) => {

  try {

    await api.delete(`/employees/${id}`);

    fetchEmployees();

  } catch (error) {

    console.error(error);

  }

};
const editEmployee = (employee) => {

  setEditingId(employee.id);

  setFirstName(employee.firstName);

  setLastName(employee.lastName);

  setEmail(employee.email);

};
const updateEmployee = async () => {

  try {

    await api.put(
      `/employees/${editingId}`,
      {
        firstName,
        lastName,
        email
      }
    );

    setEditingId(null);

    setFirstName("");
    setLastName("");
    setEmail("");

    fetchEmployees();

  } catch (error) {

    console.error(error);

  }

};


  return (
    <MainLayout>

      <h1>Employees</h1>
<div>

  <h3>Add Employee</h3>

  <input
    type="text"
    placeholder="First Name"
    value={firstName}
    onChange={(e) =>
      setFirstName(e.target.value)
    }
  />

  <br /><br />

  <input
    type="text"
    placeholder="Last Name"
    value={lastName}
    onChange={(e) =>
      setLastName(e.target.value)
    }
  />

  <br /><br />

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
  />

  <br /><br />

 {
  editingId ? (
    <button onClick={updateEmployee}>
      Update Employee
    </button>
  ) : (
    <button onClick={createEmployee}>
      Add Employee
    </button>
  )
}
</div>

<br />



      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {employees.map((employee) => (

            <tr key={employee.id}>

              <td>{employee.id}</td>

              <td>{employee.firstName}</td>

              <td>{employee.email}</td>

              <td>


  <td>

  <button
    onClick={() =>
      editEmployee(employee)
    }
  >
    Edit
  </button>

  <button
    onClick={() =>
      deleteEmployee(employee.id)
    }
  >
    Delete
  </button>

</td>
</td>

            </tr>

          ))}

        </tbody>

      </table>

    </MainLayout>
  );
}

export default Employees;