const Employee = require("../models/Employee");
const PreviousEmployee = require("../models/PreviousEmployee");

exports.moveEmployeeToPrevious = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Save to previous collection
    await PreviousEmployee.create({
      ...employee._doc,
      movedAt: new Date(),
    });

    // Remove from active collection
    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: "Employee moved to previous employees" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPreviousEmployees = async (req, res) => {
  try {
    const employees = await PreviousEmployee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
