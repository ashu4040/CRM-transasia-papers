import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [formData, setFormData] = useState({
    employee: "",
    date: "",
    loginTime: "",
    logoutTime: "",
  });

  // Fetch employees
  useEffect(() => {
    axios
      .get(`${API}/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch attendance
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API}/attendance`);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/attendance`, formData);

      fetchAttendance();

      setFormData({
        employee: "",
        date: "",
        loginTime: "",
        logoutTime: "",
      });
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API}/attendance/${id}`);
      fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-6">Mark Attendance</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 mb-8">
        <select
          name="employee"
          value={formData.employee}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />

        <input
          type="time"
          name="loginTime"
          value={formData.loginTime}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />

        <input
          type="time"
          name="logoutTime"
          value={formData.logoutTime}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="col-span-4 bg-blue-600 text-white py-3 rounded-lg"
        >
          Save Attendance
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Login</th>
            <th className="p-3 border">Logout</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id}>
              <td className="p-3 border">{record.employee?.name}</td>
              <td className="p-3 border">{record.date}</td>
              <td className="p-3 border">{record.loginTime}</td>
              <td className="p-3 border">{record.logoutTime || "-"}</td>
              <td className="p-3 border text-center">
                <button
                  onClick={() => handleDelete(record._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeAttendance;
