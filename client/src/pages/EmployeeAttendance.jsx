import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceLogout from "../components/AttendanceLogoutModal";

const API = import.meta.env.VITE_API_BASE_URL;

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [centers, setCenters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [logoutRecord, setLogoutRecord] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [formData, setFormData] = useState({
    employee: "",
    date: "",
    loginTime: "",
  });

  // Fetch employees
  useEffect(() => {
    axios
      .get(`${API}/employees`)
      .then((res) => {
        setEmployees(res.data);

        const uniqueCenters = [...new Set(res.data.map((emp) => emp.center))];
        setCenters(uniqueCenters);

        const uniqueDepartments = [
          ...new Set(res.data.map((emp) => emp.department)),
        ];
        setDepartments(uniqueDepartments);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch attendance
  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (!selectedCenter || !selectedDepartment) {
      setFilteredEmployees([]);
      return;
    }

    const filtered = employees.filter(
      (emp) =>
        emp.center?.toUpperCase().trim() ===
          selectedCenter.toUpperCase().trim() &&
        emp.department?.toUpperCase().trim() ===
          selectedDepartment.toUpperCase().trim(),
    );

    setFilteredEmployees(filtered);
  }, [selectedCenter, selectedDepartment, employees]);

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
  const openLogoutModal = (record) => {
    setLogoutRecord(record);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-6">Mark Attendance</h2>

      <form
        onSubmit={handleSubmit}
        className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-4
mb-8
"
      >
        <select
          value={selectedCenter}
          onChange={(e) => {
            setSelectedCenter(e.target.value);
            setSelectedDepartment("");
            setFormData({ ...formData, employee: "" });
            setFilteredEmployees([]);
          }}
          className="p-3 border rounded-lg"
          required
        >
          <option value="">Select Center</option>
          {centers.map((center) => (
            <option key={center} value={center}>
              {center}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setFormData({ ...formData, employee: "" });
          }}
          className="p-3 border rounded-lg"
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          name="employee"
          value={formData.employee}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        >
          <option value="">Select Employee</option>
          {filteredEmployees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        <div className="flex flex-col">
          <label className="md:hidden text-sm mb-1 text-gray-600">
            Select Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="md:hidden text-sm mb-1 text-gray-600">
            Select Login Time
          </label>

          <input
            type="time"
            name="loginTime"
            value={formData.loginTime}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="sm:col-span-2 lg:col-span-4 bg-blue-600 text-white py-3 rounded-lg w-full"
        >
          Save Attendance
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border min-w-[700px]">
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
                <td className="p-3 border">
                  {record.employee
                    ? `${record.employee.firstName} ${record.employee.lastName}`
                    : "-"}
                </td>
                <td className="p-3 border">{record.date}</td>
                <td className="p-3 border">{record.loginTime}</td>
                <td className="p-3 border">{record.logoutTime || "-"}</td>
                <td className="p-3 border text-center space-x-2">
                  {!record.logoutTime && (
                    <button
                      onClick={() => openLogoutModal(record)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Logout
                    </button>
                  )}

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
        {logoutRecord && (
          <AttendanceLogout
            record={logoutRecord}
            onClose={() => setLogoutRecord(null)}
            onSuccess={fetchAttendance}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
