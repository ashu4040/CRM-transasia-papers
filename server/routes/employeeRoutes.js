const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  moveEmployeeToPrevious,
} = require("../controllers/employeeController");
const Employee = require("../models/Employee");
// const { moveToPrevious } = require("../controllers/employeeController");

router.post("/move/:id", moveEmployeeToPrevious);
router.post("/", createEmployee);
router.get("/", getEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
