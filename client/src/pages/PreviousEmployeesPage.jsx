import React, { useEffect, useState } from "react";
import axios from "axios";
import MakeEmployeeInactiveModal from "../components/MakeEmployeeInactiveModal";

const PreviousEmployeesPage = () => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState("ALL");

  const centers = ["ALL", "DELHI", "MUMBAI", "KOLKATA", "BANGALORE"];

  // ================= FETCH PREVIOUS EMPLOYEES =================
  const fetchPreviousEmployees = async () => {
    try {
      const res = await axios.get(`${API}/previous-employees`);
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPreviousEmployees();
  }, []);

  // ================= CENTER FILTER =================
  useEffect(() => {
    if (selectedCenter === "ALL") {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter((emp) => emp.center === selectedCenter);

    setFilteredEmployees(filtered);
  }, [selectedCenter, employees]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete this employee?",
    );

    if (!confirm) return;

    try {
      await axios.delete(`${API}/previous-employees/${id}`);

      alert("Previous employee deleted successfully");

      fetchPreviousEmployees();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inactive Employees</h2>

        <div className="flex gap-3">
          {/* CENTER FILTER */}
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

          {/* MAKE INACTIVE BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Make Employee Inactive
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredEmployees.length === 0 && (
        <p className="text-gray-500">No previous employees found.</p>
      )}

      {/* LIST */}
      {filteredEmployees.map((emp) => (
        <div
          key={emp._id}
          className="border rounded-lg p-4 mb-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-lg">
              {emp.firstName} {emp.lastName}
            </p>

            <p className="text-gray-600">{emp.department}</p>

            <p className="text-sm text-gray-500">
              Center: {emp.center || "N/A"}
            </p>

            <p className="text-sm text-gray-500">
              DOJ: {new Date(emp.doj).toLocaleDateString()}
            </p>

            <p className="text-sm text-gray-500">
              DOE: {emp.doe ? new Date(emp.doe).toLocaleDateString() : "N/A"}
            </p>
          </div>

          <button
            onClick={() => handleDelete(emp._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      ))}

      {/* MODAL */}
      {showModal && (
        <MakeEmployeeInactiveModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchPreviousEmployees}
        />
      )}
    </div>
  );
};

export default PreviousEmployeesPage;
