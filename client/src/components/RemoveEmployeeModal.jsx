import React, { useEffect, useState } from "react";
import axios from "axios";

const RemoveEmployeeModal = ({ onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");

  const departments = ["MARKETING", "WAREHOUSE", "ACCOUNTS", "DRIVER", "OTHER"];
  const centers = ["DELHI", "MUMBAI", "KOLKATA", "BANGALORE"];

  // ================= FETCH EMPLOYEES =================
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employees`,
      );

      console.log("API RESPONSE:", res.data);

      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setEmployees([]);
    }
  };

  // ================= FILTER EMPLOYEES =================
  // ================= FILTER EMPLOYEES =================
  useEffect(() => {
    if (!selectedDepartment || !selectedCenter || !Array.isArray(employees)) {
      setFilteredEmployees([]);
      return;
    }

    let deptToFilter = selectedDepartment;

    if (selectedDepartment === "OTHER") {
      deptToFilter = customDepartment;
    }

    if (!deptToFilter) {
      setFilteredEmployees([]);
      return;
    }

    const filtered = employees.filter(
      (emp) =>
        emp.center &&
        emp.department &&
        emp.center.toUpperCase().trim() ===
          selectedCenter.toUpperCase().trim() &&
        emp.department.toUpperCase().trim() ===
          deptToFilter.toUpperCase().trim(),
    );

    setFilteredEmployees(filtered);
  }, [selectedCenter, selectedDepartment, customDepartment, employees]);

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!selectedEmployee) {
      alert("Please select employee");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/employees/${selectedEmployee}`,
      );

      alert("Employee Deleted Successfully");

      // refresh list without closing instantly
      await fetchEmployees();
      setSelectedDepartment("");
      setSelectedEmployee("");
      setFilteredEmployees([]);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-[500px] shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-red-600">
          Remove Employee
        </h2>

        {/* Center */}
        <select
          value={selectedCenter}
          onChange={(e) => {
            setSelectedCenter(e.target.value);
            setSelectedDepartment("");
            setSelectedEmployee("");
            setFilteredEmployees([]);
          }}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Center</option>
          {centers.map((center) => (
            <option key={center} value={center}>
              {center}
            </option>
          ))}
        </select>

        {/* Department */}
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setCustomDepartment("");
            setSelectedEmployee("");
          }}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {selectedDepartment === "OTHER" && (
          <input
            type="text"
            placeholder="Enter Department Name"
            value={customDepartment}
            onChange={(e) => setCustomDepartment(e.target.value.toUpperCase())}
            className="w-full p-3 border rounded-lg mb-4"
          />
        )}

        {/* Employee */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6"
        >
          <option value="">Select Employee</option>
          {filteredEmployees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveEmployeeModal;
