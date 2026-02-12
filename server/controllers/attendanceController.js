const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { employee, date, loginTime, logoutTime } = req.body;

    const attendance = await Attendance.create({
      employee,
      date,
      loginTime,
      logoutTime,
    });

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("employee");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await Attendance.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
