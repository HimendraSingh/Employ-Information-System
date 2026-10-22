import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const allowedDepartments = [
  "Production",
  "Systems",
  "IT Sector",
  "HR",
  "Finance",
  "Safety",
  "Store",
];

const allowedShifts = [
  "General Shift",
  "Shift A (Morning)",
  "Shift B (Evening)",
  "Shift C (Night)",
];

const allowedAttendance = ["Present", "Absent", "On Leave", "Half Day"];
const allowedPayment = ["Paid", "Pending"];

const standardDesignations = {
  Production: [
    "Plant Engineer",
    "Senior Chemical Operator",
    "Boiler Technician",
    "Production Supervisor",
    "Maintenance Engineer",
    "Shift Incharge",
  ],
  Systems: [
    "Software Engineer",
    "Network Engineer",
    "Systems Administrator",
    "Database Administrator",
    "IT Support Officer",
  ],
  "IT Sector": [
    "Full Stack Developer",
    "Software Development Engineer (SDE)",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Cloud Infrastructure Engineer",
    "Data Analyst",
    "QA / Automation Test Engineer",
    "Cybersecurity Analyst",
  ],
  Safety: [
    "Safety Officer",
    "Fire & Safety Inspector",
    "Environmental Engineer",
    "Industrial Hygiene Specialist",
  ],
  HR: [
    "HR Manager",
    "HR Executive",
    "Talent Acquisition Officer",
    "Welfare Officer",
  ],
  Finance: [
    "Finance Officer",
    "Senior Accountant",
    "Accounts Executive",
    "Auditor",
  ],
  Store: [
    "Store Keeper",
    "Inventory Controller",
    "Logistics Supervisor",
    "Material Inspector",
  ],
};

const allStandardTitles = Object.values(standardDesignations).flat();

const EmployeeForm = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
  serverError = "",
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Production",
    designation: "",
    shift: "General Shift",
    attendanceStatus: "Present",
    punchIn: "09:00 AM",
    punchOut: "05:30 PM",
    paymentStatus: "Paid",
    joiningDate: new Date().toISOString().split("T")[0],
    salary: "",
  });

  const [clientErrors, setClientErrors] = useState({});
  const [isCustomDesignation, setIsCustomDesignation] = useState(false);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      if (
        initialValues.designation &&
        !allStandardTitles.includes(initialValues.designation)
      ) {
        setIsCustomDesignation(true);
      }
      setFormData({
        name: initialValues.name || "",
        email: initialValues.email || "",
        phone: initialValues.phone || "",
        department: initialValues.department || "Production",
        designation: initialValues.designation || "",
        shift: initialValues.shift || "General Shift",
        attendanceStatus: initialValues.attendanceStatus || "Present",
        punchIn: initialValues.punchIn || "09:00 AM",
        punchOut: initialValues.punchOut || "05:30 PM",
        paymentStatus: initialValues.paymentStatus || "Paid",
        joiningDate: initialValues.joiningDate
          ? new Date(initialValues.joiningDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        salary: initialValues.salary !== undefined ? initialValues.salary : "",
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (clientErrors[name]) {
      setClientErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Employee name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Phone must be a valid 10-digit number";
      }
    }

    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
    }

    if (formData.salary === "" || Number(formData.salary) < 0) {
      errors.salary = "Salary must be a positive number";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        salary: Number(formData.salary),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      {serverError && <div className="error-alert">{serverError}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={handleChange}
          />
          {clientErrors.name && (
            <span className="field-error">{clientErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. ramesh@iffco.in"
            value={formData.email}
            onChange={handleChange}
          />
          {clientErrors.email && (
            <span className="field-error">{clientErrors.email}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone Number (10 Digits) *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={10}
            placeholder="e.g. 9876543210"
            value={formData.phone}
            onChange={handleChange}
          />
          {clientErrors.phone && (
            <span className="field-error">{clientErrors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            {allowedDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="label-with-action">
            <label htmlFor="designation">Designation *</label>
            <button
              type="button"
              className="btn-toggle-designation"
              onClick={() => setIsCustomDesignation(!isCustomDesignation)}
            >
              {isCustomDesignation ? "📋 Standard List" : "✏️ Type Custom"}
            </button>
          </div>

          {!isCustomDesignation ? (
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            >
              <option value="">-- Select Designation --</option>
              {formData.designation &&
                !allStandardTitles.includes(formData.designation) && (
                  <option value={formData.designation}>
                    {formData.designation} (Current)
                  </option>
                )}
              <optgroup label={`⭐ Main Designations (${formData.department})`}>
                {(standardDesignations[formData.department] || []).map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </optgroup>
              {Object.entries(standardDesignations)
                .filter(([deptName]) => deptName !== formData.department)
                .map(([deptName, titles]) => (
                  <optgroup key={deptName} label={`📂 Other Options (${deptName})`}>
                    {titles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>
          ) : (
            <input
              id="designation"
              name="designation"
              type="text"
              placeholder="e.g. Senior Chemical Specialist"
              value={formData.designation}
              onChange={handleChange}
            />
          )}

          {clientErrors.designation && (
            <span className="field-error">{clientErrors.designation}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="shift">Assigned Plant Shift *</label>
          <select
            id="shift"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
          >
            {allowedShifts.map((shiftName) => (
              <option key={shiftName} value={shiftName}>
                {shiftName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="attendanceStatus">Daily Attendance Status</label>
          <select
            id="attendanceStatus"
            name="attendanceStatus"
            value={formData.attendanceStatus}
            onChange={handleChange}
          >
            {allowedAttendance.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paymentStatus">Salary Payment Status</label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
          >
            {allowedPayment.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="punchIn">In-Time (Punch In)</label>
          <input
            id="punchIn"
            name="punchIn"
            type="text"
            placeholder="09:00 AM"
            value={formData.punchIn}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="punchOut">Out-Time (Punch Out)</label>
          <input
            id="punchOut"
            name="punchOut"
            type="text"
            placeholder="05:30 PM"
            value={formData.punchOut}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salary">Salary (₹ per month) *</label>
          <input
            id="salary"
            name="salary"
            type="number"
            min="0"
            placeholder="e.g. 65000"
            value={formData.salary}
            onChange={handleChange}
          />
          {clientErrors.salary && (
            <span className="field-error">{clientErrors.salary}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="joiningDate">Joining Date</label>
          <input
            id="joiningDate"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <Link to="/dashboard" className="btn-cancel">
          Cancel
        </Link>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading
            ? isEditMode
              ? "Updating Employee..."
              : "Adding Employee..."
            : isEditMode
            ? "Update Employee"
            : "Add Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
