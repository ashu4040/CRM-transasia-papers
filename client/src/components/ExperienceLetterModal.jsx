import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const ExperienceLetterModal = ({ onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employees`,
      );
      setEmployees(res.data);

      // extract unique departments
      const uniqueDepartments = [
        ...new Set(res.data.map((emp) => emp.department)),
      ];
      setDepartments(uniqueDepartments);
    };

    fetchEmployees();
  }, []);

  // Filter employees by department
  useEffect(() => {
    if (!selectedDepartment) {
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

    const filtered = employees.filter((emp) => emp.department === deptToFilter);

    setFilteredEmployees(filtered);
  }, [selectedDepartment, customDepartment, employees]);

  // Generate Experience Letter
  const generateExperienceLetter = async () => {
    const employee = employees.find((e) => e._id === selectedEmployee);

    if (!employee || !exitDate) {
      alert("Please select employee and exit date");
      return;
    }

    const confirmRemove = window.confirm(
      "Do you want to remove this employee from Active Employees?",
    );

    try {
      // If YES → move employee to PreviousEmployee collection
      if (confirmRemove) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/employees/move/${selectedEmployee}`,
          { doe: exitDate },
        );
      } else {
        // If NO → just update DOE in active employee
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/employees/${selectedEmployee}`,
          { doe: exitDate },
        );
      }

      // 🔥 Generate PDF
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("EXPERIENCE LETTER", 60, 20);

      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

      doc.text(
        `This is to certify that ${employee.firstName} ${employee.lastName}`,
        20,
        60,
      );

      doc.text(
        `worked with Transia CRM in the ${employee.department} department`,
        20,
        75,
        { maxWidth: 170 },
      );

      doc.text(
        `from ${new Date(employee.doj).toLocaleDateString()} to ${new Date(
          exitDate,
        ).toLocaleDateString()}.`,
        20,
        90,
        { maxWidth: 170 },
      );

      doc.text(
        `During this period, their performance was found satisfactory.`,
        20,
        110,
      );

      doc.text("We wish them success in future endeavors.", 20, 130);

      doc.text("HR Department", 20, 160);
      doc.text("Transia CRM", 20, 170);

      doc.save(
        `${employee.firstName}_${employee.lastName}_Experience_Letter.pdf`,
      );

      alert("Experience Letter Generated Successfully");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-[500px] shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Generate Experience Letter
        </h2>

        {/* Department */}
        {/* Department */}
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setCustomDepartment("");
          }}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Department</option>
          <option value="MARKETING">MARKETING</option>
          <option value="WAREHOUSE">WAREHOUSE</option>
          <option value="ACCOUNTS">ACCOUNTS</option>
          <option value="DRIVER">DRIVER</option>
          <option value="OTHER">OTHER</option>
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
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Select Employee</option>
          {filteredEmployees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
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
            onClick={generateExperienceLetter}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceLetterModal;
