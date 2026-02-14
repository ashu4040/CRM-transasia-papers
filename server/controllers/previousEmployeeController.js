const Employee = require("../models/Employee");
const PreviousEmployee = require("../models/PreviousEmployee");

exports.moveEmployeeToPrevious = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { doe } = req.body;

    if (!doe) {
      return res.status(400).json({ error: "DOE is required" });
    }

    // ✅ Convert mongoose document → plain object
    const employeeData = employee.toObject();

    // ✅ Remove Mongo internal fields (hidden bug fix)
    delete employeeData._id;
    delete employeeData.__v;

    // ✅ Create previous employee safely
    await PreviousEmployee.create({
      ...employeeData,
      doe: new Date(doe),
      movedAt: new Date(),
    });

    // ✅ Remove from active employees
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

exports.deletePreviousEmployee = async (req, res) => {
  try {
    const employee = await PreviousEmployee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Previous employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
