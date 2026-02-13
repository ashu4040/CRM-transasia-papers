const express = require("express");
const router = express.Router();
const {
  moveEmployeeToPrevious,
  getPreviousEmployees,
} = require("../controllers/previousEmployeeController");

router.get("/", getPreviousEmployees);
router.post("/move/:id", moveEmployeeToPrevious);

module.exports = router;
