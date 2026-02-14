import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./layouts/Navbar";
import Sidebar from "./layouts/SideBar";

import EmployeeAdmission from "./pages/EmployeeAdmission";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import PreviousEmployeesPage from "./pages/PreviousEmployeesPage";
import ActiveEmployeesPage from "./pages/ActiveEmployeesPage";

function App() {
  // ✅ sidebar control state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* NAVBAR */}
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <Sidebar
            isOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
          />

          {/* PAGE CONTENT */}
          <div className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/admission" element={<EmployeeAdmission />} />
              <Route path="/attendance" element={<EmployeeAttendance />} />
              <Route
                path="/previous-employees"
                element={<PreviousEmployeesPage />}
              />
              <Route
                path="/active-employees"
                element={<ActiveEmployeesPage />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
