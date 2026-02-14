import React, { useEffect, useState } from "react";
import axios from "axios";

const MakeEmployeeInactiveModal = ({ onClose, onSuccess }) => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [exitDate, setExitDate] = useState("");

  const centers = ["DELHI", "MUMBAI", "KOLKATA", "BANGALORE"];

  // ================= FETCH ACTIVE EMPLOYEES =================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API}/employees`);
        setEmployees(res.data);
        console.log("Employees:", res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  // ================= FILTER DEPARTMENTS BY CENTER =================
  useEffect(() => {
    if (!selectedCenter) {
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }

    const uniqueDepartments = [
      ...new Set(
        employees
          .filter((emp) => emp.center === selectedCenter)
          .map((emp) => emp.department),
      ),
    ];

    setDepartments(uniqueDepartments);
    setSelectedDepartment("");
    setSelectedEmployee("");
  }, [selectedCenter, employees]);

  // ================= FILTER EMPLOYEES =================
  useEffect(() => {
    if (!selectedDepartment || !selectedCenter) {
      setFilteredEmployees([]);
      return;
    }

    const filtered = employees.filter(
      (emp) =>
        emp.department === selectedDepartment && emp.center === selectedCenter,
    );

    setFilteredEmployees(filtered);
  }, [selectedDepartment, selectedCenter, employees]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!selectedEmployee || !exitDate) {
      alert("Please select employee and exit date");
      return;
    }

    try {
      await axios.post(`${API}/previous-employees/move/${selectedEmployee}`, {
        doe: exitDate,
      });

      alert("Employee marked as Inactive successfully");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-[500px] shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Make Employee Inactive</h2>

        {/* ================= CENTER ================= */}
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Center</option>
          {centers.map((center) => (
            <option key={center} value={center}>
              {center}
            </option>
          ))}
        </select>

        {/* ================= DEPARTMENT ================= */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          disabled={!selectedCenter}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* ================= EMPLOYEE ================= */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          disabled={!selectedDepartment}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Employee</option>
          {filteredEmployees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        {/* ================= EXIT DATE ================= */}
        <input
          type="date"
          value={exitDate}
          onChange={(e) => setExitDate(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeEmployeeInactiveModal;
