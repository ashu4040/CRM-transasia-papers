import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordModal from "../components/PasswordModal";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleAdminSuccess = () => {
    setShowPassword(false);
    closeSidebar();
    navigate("/admission");
  };

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 md:hidden z-40"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR FROM RIGHT */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0 md:static
          z-50
        `}
      >
        {/* DASHBOARD */}
        <Link
          to="/dashboard"
          onClick={closeSidebar}
          className="block p-3 rounded-lg hover:bg-gray-100 "
        >
          Dashboard
        </Link>

        {/* EMPLOYEE DROPDOWN */}
        <button
          onClick={() => setEmployeeOpen(!employeeOpen)}
          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 flex justify-between"
        >
          Employee
          <span>{employeeOpen ? "▲" : "▼"}</span>
        </button>

        {employeeOpen && (
          <div className="ml-4 mt-2">
            <Link
              to="/attendance"
              onClick={closeSidebar}
              className="block p-2 rounded-lg hover:bg-gray-100 text-sm"
            >
              Employee Attendance
            </Link>
          </div>
        )}

        {/* ADMIN PANEL WITH PASSWORD */}
        <button
          onClick={() => setShowPassword(true)}
          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 flex justify-between"
        >
          Admin Panel
        </button>
      </div>

      {/* PASSWORD MODAL */}
      <PasswordModal
        isOpen={showPassword}
        onClose={() => setShowPassword(false)}
        onSuccess={handleAdminSuccess}
      />
    </>
  );
};

export default Sidebar;
