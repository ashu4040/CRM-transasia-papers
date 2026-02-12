import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import ExperienceLetterModal from "../components/ExperienceLetterModal";
import RemoveEmployeeModal from "../components/RemoveEmployeeModal";

const EmployeeAdmission = () => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showExperience, setShowExperience] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    personalMobile: "",
    coco: "",
    doj: "",

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
      try {
        const res = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/positions",
        );
        setCountries(res.data.data.map((c) => c.name));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, []);

  // ================= FETCH STATES =================
  const fetchStates = async (country) => {
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country },
      );

      setStates(res.data.data.states.map((s) => s.name));
    } catch (err) {
      console.error(err);
    }
  };

  // fetch city
  const fetchCities = async (country, state) => {
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country, state },
      );

      setCities(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e, section = null) => {
    let { name, value } = e.target;

    if (
      name !== "salary" &&
      name !== "doj" &&
      name !== "country" &&
      name !== "state" &&
      name !== "city"
    ) {
      value = value.toUpperCase();
    }

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

    setFormData((prev) => ({
      ...prev,
      sameAddress: checked,
      currentAddress: checked
        ? { ...prev.permanentAddress }
        : {
            country: "",
            state: "",
            city: "",
            zipCode: "",
            line1: "",
            line2: "",
          },
    }));
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!formData.firstName) return false;
    if (!formData.lastName) return false;
    if (!formData.email) return false;
    if (!formData.personalMobile) return false;
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

  // ================= GENERATE JOINING LETTER =================
  const generateJoiningLetter = (employee, isDuplicate = false) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("JOINING LETTER", 70, 20);

    if (isDuplicate) {
      doc.setFontSize(30);
      doc.setTextColor(200, 200, 200);
      doc.text("DUPLICATE COPY", 35, 150, { angle: 45 });
      doc.setTextColor(0, 0, 0);
    }

    doc.setFontSize(12);
    doc.text(`Print Date: ${new Date().toLocaleDateString()}`, 20, 40);

    doc.text(`To,`, 20, 60);
    doc.text(`${employee.firstName} ${employee.lastName}`, 20, 70);

    doc.text(
      `We are pleased to appoint you in the ${employee.department} department at Transia CRM.`,
      20,
      90,
      { maxWidth: 170 },
    );

    doc.text(
      `Your date of joining is ${new Date(employee.doj).toLocaleDateString()}.`,
      20,
      110,
    );

    doc.text(`Salary: ₹${employee.salary} per month`, 20, 125);

    doc.text("HR Department", 20, 160);
    doc.text("Transia CRM", 20, 170);

    doc.save(`${employee.firstName}_${employee.lastName}_Joining_Letter.pdf`);
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
      const res = await axios.post(`${API}/employees`, payload);

      const confirmDraft = window.confirm(
        "Do you want to generate Joining Letter Draft?",
      );

      if (confirmDraft) {
        generateJoiningLetter(res.data, false);
      }

      alert("Employee Saved Successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving employee");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Employee Joining</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <Input
          label="First Name"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <Input
          label="Last Name"
          name="lastName"
          required
          value={formData.lastName}
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
          label="Personal Mobile"
          name="personalMobile"
          required
          value={formData.personalMobile}
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
          countries={countries}
          states={states}
          cities={cities}
          fetchStates={fetchStates}
          fetchCities={fetchCities}
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
          countries={countries}
          states={states}
          cities={cities}
          fetchStates={fetchStates}
          fetchCities={fetchCities}
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
        className="w-full bg-red-600 text-white py-3 rounded-lg mt-4"
      >
        Make Experience Letter
      </button>

      {showExperience && (
        <ExperienceLetterModal onClose={() => setShowExperience(false)} />
      )}

      <button
        type="button"
        onClick={() => setShowRemove(true)}
        className="w-full bg-red-700 text-white py-3 rounded-lg mt-4"
      >
        Remove Employee
      </button>

      {showRemove && (
        <RemoveEmployeeModal onClose={() => setShowRemove(false)} />
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

const SectionTitle = ({ title }) => (
  <div className="col-span-2 font-semibold text-lg mt-6">{title}</div>
);

const AddressSection = ({
  address,
  section,
  handleChange,
  countries,
  states,
  cities,
  fetchStates,
  fetchCities,
}) => (
  <>
    {/* COUNTRY */}
    <div>
      <label className="block mb-1">Country *</label>
      <select
        name="country"
        value={address.country}
        onChange={(e) => {
          handleChange(e, section);
          fetchStates(e.target.value);
        }}
        className="p-3 border rounded-lg w-full"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>

    {/* STATE */}
    <div>
      <label className="block mb-1">State *</label>
      <select
        name="state"
        value={address.state}
        onChange={(e) => {
          handleChange(e, section);
          fetchCities(address.country, e.target.value);
        }}
        className="p-3 border rounded-lg w-full"
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>

    {/* CITY */}
    <div>
      <label className="block mb-1">City *</label>
      <select
        name="city"
        value={address.city}
        onChange={(e) => handleChange(e, section)}
        className="p-3 border rounded-lg w-full"
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>

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
