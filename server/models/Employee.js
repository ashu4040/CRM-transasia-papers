const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },

    coco: { type: String }, // Company mobile (optional)

    doj: { type: Date, required: true },
    doe: { type: Date }, // optional

    permanentAddress: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String, required: true },
    },

    currentAddress: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String, required: true },
    },

    department: { type: String, required: true },

    bankDetails: {
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifsc: { type: String, required: true },
    },

    salary: { type: Number, required: true },
    panCard: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", employeeSchema);
