const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String, // store YYYY-MM-DD
    required: true,
  },
  loginTime: {
    type: String, // HH:mm
    required: true,
  },
  logoutTime: {
    type: String, // HH:mm
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
