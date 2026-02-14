const mongoose = require("mongoose");

const previousEmployeeSchema = new mongoose.Schema(
  {
    center: String,

    firstName: String,
    lastName: String,
    personalMobile: String,
    email: String,
    coco: String,
    doj: Date,
    doe: Date,

    permanentAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      line1: String,
      line2: String,
    },

    currentAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      line1: String,
      line2: String,
    },

    department: String,

    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifsc: String,
    },

    salary: Number,
    panCard: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("PreviousEmployee", previousEmployeeSchema);
