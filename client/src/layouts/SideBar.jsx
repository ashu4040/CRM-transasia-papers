import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-full p-4">
      <Link
        to="/attendance"
        className="block bg-gray-100 p-3 rounded-lg hover:bg-gray-200"
      >
        Employee Attendance
      </Link>
    </div>
  );
};

export default Sidebar;
