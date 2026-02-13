import React, { useEffect, useState } from "react";
import axios from "axios";

const MakeEmployeeInactiveModal = ({ onClose, onSuccess }) => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [exitDate, setExitDate] = useState("");

  // Fetch active employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API}/employees`);
        setEmployees(res.data);

        const uniqueDepartments = [
          ...new Set(res.data.map((emp) => emp.department)),
        ];

        setDepartments(uniqueDepartments);
        console.log("Employees:", res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  // Filter by department
  useEffect(() => {
    if (!selectedDepartment) {
      setFilteredEmployees([]);
      return;
    }

    const filtered = employees.filter(
      (emp) => emp.department === selectedDepartment,
    );

    setFilteredEmployees(filtered);
  }, [selectedDepartment, employees]);

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

      onSuccess(); // refresh page data
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-[500px] shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Make Employee Inactive</h2>

        {/* Department */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Employee */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Employee</option>
          {filteredEmployees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        {/* Exit Date */}
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
