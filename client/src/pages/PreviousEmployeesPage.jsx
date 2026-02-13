import React, { useEffect, useState } from "react";
import axios from "axios";
import MakeEmployeeInactiveModal from "../components/MakeEmployeeInactiveModal";

const PreviousEmployeesPage = () => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchPreviousEmployees = async () => {
    try {
      const res = await axios.get(`${API}/previous-employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPreviousEmployees();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete this employee?",
    );

    if (!confirm) return;

    try {
      await axios.delete(`${API}/previous-employees/${id}`);

      alert("Previous employee deleted successfully");

      fetchPreviousEmployees(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inactive Employees</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Make Employee Inactive
        </button>
      </div>

      {employees.length === 0 && (
        <p className="text-gray-500">No previous employees found.</p>
      )}

      {employees.map((emp) => (
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
