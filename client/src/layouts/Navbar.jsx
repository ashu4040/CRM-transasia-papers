import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordModal from "../components/PasswordModal";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/admission");
  };

  return (
    <>
      <div className="h-16 bg-white shadow flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-blue-600">CRM</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Admin panel
        </button>
      </div>

      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default Navbar;
