import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [emp,     setEmp]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");

    if (!token || role !== "EMPLOYEE") {
      setLoading(false);
      return;
    }

    api.get("/employees/me")
      .then(res  => setEmp(res.data))
      .catch(err => {
        console.error("Failed to fetch employee profile:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <EmployeeContext.Provider value={{ emp, loading, error }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  return useContext(EmployeeContext);
}
