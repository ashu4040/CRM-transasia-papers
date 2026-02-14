const mongoose = require("mongoose");

const previousEmployeeSchema = new mongoose.Schema(
  {
    // ✅ CENTER (same as Employee schema)
    center: {
      type: String,
      required: true,
      enum: ["DELHI", "MUMBAI", "KOLKATA", "BANGALORE"],
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    personalMobile: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    coco: String,

    doj: {
      type: Date,
      required: true,
    },

    doe: {
      type: Date,
      required: true, // leaving employee must have exit date
    },

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

    department: {
      type: String,
      required: true,
    },

    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifsc: String,
    },

    // ✅ keep same datatype as Employee schema
    salary: {
      type: Number,
      required: true,
    },

    panCard: {
      type: String,
      required: true,
    },

    // ✅ optional audit field (VERY useful later)
    movedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PreviousEmployee", previousEmployeeSchema);
