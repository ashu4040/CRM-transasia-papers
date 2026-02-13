import React, { useEffect, useState } from "react";
import axios from "axios";

const PreviousEmployeesModal = ({ onClose }) => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [employees, setEmployees] = useState([]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Previous Employees</h2>

        {employees.length === 0 && <p>No previous employees found.</p>}

        {employees.map((emp) => (
          <div key={emp._id} className="border p-4 rounded-lg mb-3">
            <p className="font-semibold">
              {emp.firstName} {emp.lastName}
            </p>
            <p className="text-sm text-gray-500">{emp.department}</p>
          </div>
        ))}

        <button onClick={onClose} className="mt-4 px-4 py-2 border rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviousEmployeesModal;
