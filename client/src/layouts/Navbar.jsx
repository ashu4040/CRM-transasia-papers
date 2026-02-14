import React from "react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-6 relative z-10">
      {/* LOGO LEFT */}
      <h1 className="text-2xl font-bold text-blue-600">CRM</h1>

      {/* MENU BUTTON (MOBILE ONLY) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-2xl text-gray-700"
      >
        ☰
      </button>
    </div>
  );
};

export default Navbar;
