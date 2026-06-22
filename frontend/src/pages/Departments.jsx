import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Departments() {

  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {

    try {

      const response =
        await api.get("/departments");

      setDepartments(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const createDepartment = async () => {

    try {

      await api.post("/departments", {
        departmentName
      });

      setDepartmentName("");

      fetchDepartments();

    } catch (error) {

      console.error(error);

    }

  };

  const editDepartment = (department) => {

    setEditingId(department.id);

    setDepartmentName(
      department.departmentName
    );

  };

  const updateDepartment = async () => {

    try {

      await api.put(
        `/departments/${editingId}`,
        {
          departmentName
        }
      );

      setEditingId(null);

      setDepartmentName("");

      fetchDepartments();

    } catch (error) {

      console.error(error);

    }

  };

  const deleteDepartment = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete Department?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/departments/${id}`
      );

      fetchDepartments();

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <MainLayout>

      <h1>Departments</h1>

      <input
        type="text"
        placeholder="Department Name"
        value={departmentName}
        onChange={(e) =>
          setDepartmentName(e.target.value)
        }
      />

      <br /><br />

      {
        editingId ? (
          <button
            onClick={updateDepartment}
          >
            Update Department
          </button>
        ) : (
          <button
            onClick={createDepartment}
          >
            Add Department
          </button>
        )
      }

      <br /><br />

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {
            departments.map((department) => (

              <tr key={department.id}>

                <td>{department.id}</td>

                <td>
                  {department.departmentName}
                </td>

                <td>

                  <button
                    onClick={() =>
                      editDepartment(department)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteDepartment(
                        department.id
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

export default Departments;