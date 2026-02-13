const Employee = require("../server/models/Employee");
const PreviousEmployee = require("../server/models/PreviousEmployee");

exports.moveEmployeeToPrevious = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const previousEmployee = new PreviousEmployee({
      ...employee._doc,
      doe: new Date(), // date of exit
    });

    await previousEmployee.save();

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: "Employee moved to Previous Employees" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
