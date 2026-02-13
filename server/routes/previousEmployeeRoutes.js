const express = require("express");
const router = express.Router();
const {
  moveEmployeeToPrevious,
  getPreviousEmployees,
  deletePreviousEmployee,
} = require("../controllers/previousEmployeeController");

router.get("/", getPreviousEmployees);
router.post("/move/:id", moveEmployeeToPrevious);
router.delete("/:id", deletePreviousEmployee);

module.exports = router;
