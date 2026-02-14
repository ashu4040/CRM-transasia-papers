const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  deleteAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

router.post("/", markAttendance);
router.get("/", getAttendance);
router.delete("/:id", deleteAttendance);
router.put("/:id", updateAttendance);

module.exports = router;
