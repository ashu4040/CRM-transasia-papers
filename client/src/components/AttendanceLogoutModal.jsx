import React, { useState } from "react";
import axios from "axios";

const AttendanceLogout = ({ record, onClose, onSuccess }) => {
  const API = import.meta.env.VITE_API_BASE_URL;

  // default logout = login time
  const [logoutTime, setLogoutTime] = useState(record.loginTime);

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/attendance/${record._id}`, {
        logoutTime,
      });

      onSuccess(); // refresh attendance
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      alert("Failed to update logout time");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Update Logout Time</h2>

        <p className="mb-2 text-sm text-gray-600">
          Employee: {record.employee?.firstName} {record.employee?.lastName}
        </p>

        <label className="block mb-1">Logout Time</label>
        <input
          type="time"
          value={logoutTime}
          onChange={(e) => setLogoutTime(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLogout;
