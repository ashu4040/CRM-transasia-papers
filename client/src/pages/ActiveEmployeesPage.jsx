import React, { useEffect, useState } from "react";
import axios from "axios";

const ActiveEmployeesPage = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [employees, setEmployees] = useState([]);

  const fetchActiveEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActiveEmployees();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Active Employees</h2>

      {employees.length === 0 && (
        <p className="text-gray-500">No active employees found.</p>
      )}

      {employees.map((emp) => (
        <div key={emp._id} className="border rounded-lg p-4 mb-4">
          <p className="font-semibold text-lg">
            {emp.firstName} {emp.lastName}
          </p>

          <p className="text-gray-600">{emp.department}</p>

          <p className="text-sm text-gray-500">Center: {emp.center || "N/A"}</p>

          <p className="text-sm text-gray-500">
            DOJ: {new Date(emp.doj).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ActiveEmployeesPage;
