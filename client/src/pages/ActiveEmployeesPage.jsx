import React, { useEffect, useState } from "react";
import axios from "axios";

const ActiveEmployeesPage = () => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("ALL");

  const centers = ["ALL", "DELHI", "MUMBAI", "KOLKATA", "BANGALORE"];

  // ================= FETCH EMPLOYEES =================
  const fetchActiveEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
      setFilteredEmployees(res.data); // default show all
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActiveEmployees();
  }, []);

  // ================= FILTER BY CENTER =================
  useEffect(() => {
    if (selectedCenter === "ALL") {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter((emp) => emp.center === selectedCenter);

    setFilteredEmployees(filtered);
  }, [selectedCenter, employees]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Employees</h2>

        {/* CENTER FILTER DROPDOWN */}
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          {centers.map((center) => (
            <option key={center} value={center}>
              {center}
            </option>
          ))}
        </select>
      </div>

      {/* EMPTY STATE */}
      {filteredEmployees.length === 0 && (
        <p className="text-gray-500">No employees found.</p>
      )}

      {/* EMPLOYEE LIST */}
      {filteredEmployees.map((emp) => (
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
