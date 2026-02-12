const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  updateEmployee,
} = require("../controllers/employeeController");

router.post("/", createEmployee);
router.get("/", getEmployees);
router.put("/:id", updateEmployee);

module.exports = router;
