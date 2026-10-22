const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: [
          "Production",
          "Systems",
          "IT Sector",
          "IT",
          "HR",
          "Finance",
          "Safety",
          "Store",
        ],
        message: "Invalid department selection",
      },
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    shift: {
      type: String,
      enum: {
        values: [
          "Shift A (Morning)",
          "Shift B (Evening)",
          "Shift C (Night)",
          "General Shift",
        ],
        message: "Invalid shift selection",
      },
      default: "General Shift",
    },
    attendanceStatus: {
      type: String,
      enum: {
        values: ["Present", "Absent", "On Leave", "Half Day"],
        message: "Invalid attendance status",
      },
      default: "Present",
    },
    punchIn: {
      type: String,
      default: "09:00 AM",
    },
    punchOut: {
      type: String,
      default: "05:30 PM",
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["Paid", "Pending"],
        message: "Invalid payment status",
      },
      default: "Paid",
    },
    lastPaymentDate: {
      type: Date,
      default: Date.now,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be a negative number"],
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
