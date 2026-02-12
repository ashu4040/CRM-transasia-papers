import React, { useState, useEffect } from "react";
import axios from "axios";
import ExperienceLetterModal from "../components/ExperienceLetterModal";
import { jsPDF } from "jspdf";

const EmployeeAdmission = () => {
  const [countries, setCountries] = useState([]);
  const [permanentStates, setPermanentStates] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);
  const [currentStates, setCurrentStates] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);
  const [showExperience, setShowExperience] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    coco: "",
    doj: "",
    doe: "",

    permanentAddress: {
      country: "",
      state: "",
      city: "",
      zipCode: "",
      line1: "",
      line2: "",
    },

    currentAddress: {
      country: "",
      state: "",
      city: "",
      zipCode: "",
      line1: "",
      line2: "",
    },

    sameAddress: false,

    department: "",
    newDepartment: "",

    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifsc: "",
    },

    salary: "",
    panCard: "",
  });

  // ================= FETCH COUNTRIES =================
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/positions",
      );
      setCountries(res.data.data.map((c) => c.name.toUpperCase()));
    };
    fetchCountries();
  }, []);

  // joining letter
  const generateJoiningLetter = (employee) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("JOINING LETTER", 70, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

    doc.text(`To,`, 20, 60);
    doc.text(employee.name, 20, 70);

    doc.text(
      `We are pleased to appoint you in the ${employee.department} department at Transia CRM.`,
      20,
      90,
      { maxWidth: 170 },
    );

    doc.text(
      `Your date of joining will be ${new Date(employee.doj).toLocaleDateString()}.`,
      20,
      110,
    );

    doc.text(`Salary: ₹${employee.salary} per month`, 20, 125);

    doc.text("Bank Details:", 20, 145);
    doc.text(`Bank: ${employee.bankDetails.bankName}`, 20, 155);
    doc.text(`Account: ${employee.bankDetails.accountNumber}`, 20, 165);
    doc.text(`IFSC: ${employee.bankDetails.ifsc}`, 20, 175);

    doc.text("We look forward to your contribution.", 20, 195);

    doc.text("HR Department", 20, 220);
    doc.text("Transia CRM", 20, 230);

    doc.save(`${employee.name}_Joining_Letter.pdf`);
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e, section = null) => {
    let { name, value } = e.target;

    // Force uppercase everywhere except dates & salary
    if (name !== "salary" && name !== "doj" && name !== "doe")
      value = value.toUpperCase();

    if (section === "permanent") {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: {
          ...prev.permanentAddress,
          [name]: value,
        },
      }));
    } else if (section === "current") {
      setFormData((prev) => ({
        ...prev,
        currentAddress: {
          ...prev.currentAddress,
          [name]: value,
        },
      }));
    } else if (section === "bank") {
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ================= SAME ADDRESS =================
  const handleSameAddress = (e) => {
    const checked = e.target.checked;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        sameAddress: true,
        currentAddress: { ...prev.permanentAddress },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        sameAddress: false,
        currentAddress: {
          country: "",
          state: "",
          city: "",
          zipCode: "",
          line1: "",
          line2: "",
        },
      }));
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!formData.name) return false;
    if (!formData.email) return false;
    if (!formData.mobile) return false;
    if (!formData.doj) return false;

    const p = formData.permanentAddress;
    const c = formData.currentAddress;
    const b = formData.bankDetails;

    if (!p.country || !p.state || !p.city || !p.zipCode || !p.line1 || !p.line2)
      return false;
    if (!c.country || !c.state || !c.city || !c.zipCode || !c.line1 || !c.line2)
      return false;

    if (!formData.department) return false;
    if (!b.bankName || !b.accountNumber || b.ifsc.length !== 11) return false;
    if (!formData.salary) return false;
    if (!formData.panCard) return false;

    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Please fill all required fields properly.");
      return;
    }

    const finalDepartment =
      formData.department === "OTHER"
        ? formData.newDepartment
        : formData.department;

    const payload = {
      ...formData,
      department: finalDepartment,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/employees",
        payload,
      );

      generateJoiningLetter(res.data); // 🔥 generate PDF

      alert("Employee Saved & Joining Letter Generated");
    } catch (err) {
      console.error(err);
      alert("Error saving employee");
    }
  };

  // ================= UI =================
  return (
    <div className="bg-white p-8 rounded-2xl shadow max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Employee Admission</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <Input
          label="Name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Mobile"
          name="mobile"
          required
          value={formData.mobile}
          onChange={handleChange}
        />

        <Input
          label="COCO (Company Mobile)"
          name="coco"
          value={formData.coco}
          onChange={handleChange}
        />

        <Input
          label="Date of Joining"
          name="doj"
          type="date"
          required
          value={formData.doj}
          onChange={handleChange}
        />

        <SectionTitle title="Permanent Address" />

        <AddressSection
          address={formData.permanentAddress}
          section="permanent"
          handleChange={handleChange}
        />

        <div className="col-span-2">
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={formData.sameAddress}
              onChange={handleSameAddress}
            />
            Current address same as permanent
          </label>
        </div>

        <SectionTitle title="Current Address" />

        <AddressSection
          address={formData.currentAddress}
          section="current"
          handleChange={handleChange}
        />

        <SectionTitle title="Employment Details" />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="p-3 border rounded-lg w-full"
          required
        >
          <option value="">SELECT DEPARTMENT *</option>
          <option value="MARKETING">MARKETING</option>
          <option value="WAREHOUSE">WAREHOUSE</option>
          <option value="ACCOUNTS">ACCOUNTS</option>
          <option value="DRIVER">DRIVER</option>
          <option value="OTHER">OTHER</option>
        </select>

        {formData.department === "OTHER" && (
          <Input
            label="Enter New Department"
            name="newDepartment"
            required
            value={formData.newDepartment}
            onChange={handleChange}
          />
        )}

        <Input
          label="Bank Name"
          name="bankName"
          required
          value={formData.bankDetails.bankName}
          onChange={(e) => handleChange(e, "bank")}
        />
        <Input
          label="Account Number"
          name="accountNumber"
          required
          value={formData.bankDetails.accountNumber}
          onChange={(e) => handleChange(e, "bank")}
        />
        <Input
          label="IFSC (11 CHAR)"
          name="ifsc"
          required
          value={formData.bankDetails.ifsc}
          onChange={(e) => handleChange(e, "bank")}
        />

        <Input
          label="Salary"
          name="salary"
          type="number"
          required
          value={formData.salary}
          onChange={handleChange}
        />
        <Input
          label="PAN Card"
          name="panCard"
          required
          value={formData.panCard}
          onChange={handleChange}
        />

        <button className="col-span-2 bg-blue-600 text-white py-3 rounded-lg">
          Submit
        </button>
      </form>
      <button
        type="button"
        onClick={() => setShowExperience(true)}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 mt-4"
      >
        Make Experience Letter
      </button>

      {showExperience && (
        <ExperienceLetterModal onClose={() => setShowExperience(false)} />
      )}
    </div>
  );
};

export default EmployeeAdmission;

const Input = ({ label, required, ...props }) => (
  <div>
    <label className="block mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input {...props} className="p-3 border rounded-lg w-full" />
  </div>
);

const AddressSection = ({ address, section, handleChange }) => (
  <>
    <Input
      label="Country"
      required
      name="country"
      value={address.country}
      onChange={(e) => handleChange(e, section)}
    />
    <Input
      label="State"
      required
      name="state"
      value={address.state}
      onChange={(e) => handleChange(e, section)}
    />
    <Input
      label="City"
      required
      name="city"
      value={address.city}
      onChange={(e) => handleChange(e, section)}
    />
    <Input
      label="ZIP Code"
      required
      name="zipCode"
      value={address.zipCode}
      onChange={(e) => handleChange(e, section)}
    />
    <Input
      label="Address Line 1"
      required
      name="line1"
      value={address.line1}
      onChange={(e) => handleChange(e, section)}
    />
    <Input
      label="Address Line 2"
      required
      name="line2"
      value={address.line2}
      onChange={(e) => handleChange(e, section)}
    />
  </>
);

const SectionTitle = ({ title }) => (
  <div className="col-span-2 font-semibold text-lg mt-6">{title}</div>
);
