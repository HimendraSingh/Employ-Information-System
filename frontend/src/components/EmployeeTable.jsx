import React from "react";
import { Link } from "react-router-dom";

const EmployeeTable = ({
  employees,
  onDelete,
  onViewPaySlip,
  onViewIdCard,
  onOpenAttendance,
  onTogglePayment,
}) => {
  const formatSalary = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const getAttendanceClass = (status) => {
    switch (status) {
      case "Present":
        return "badge-present";
      case "Absent":
        return "badge-absent";
      case "On Leave":
        return "badge-leave";
      case "Half Day":
        return "badge-halfday";
      default:
        return "badge-present";
    }
  };

  return (
    <div className="table-responsive">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Shift</th>
            <th>Gate Attendance & Punch Times</th>
            <th>Salary & Disbursement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>
                <div className="employee-profile-cell">
                  <div className={`avatar-initials avatar-${emp.department.toLowerCase().replace(/\s+/g, "-")}`}>
                    {emp.name
                      ? emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "EM"}
                  </div>
                  <div>
                    <strong className="employee-name">{emp.name}</strong>
                    <div className="table-subtext">
                      {emp.email} • {emp.phone}
                    </div>
                    <div className="table-designation">
                      {emp.designation}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`badge badge-${emp.department.toLowerCase().replace(/\s+/g, "-")}`}>
                  {emp.department}
                </span>
              </td>
              <td>
                <span className="shift-tag">{emp.shift || "General Shift"}</span>
              </td>
              <td>
                <span
                  className={`badge-attendance ${getAttendanceClass(
                    emp.attendanceStatus || "Present"
                  )}`}
                >
                  {emp.attendanceStatus || "Present"}
                </span>
                <div className="punch-display">
                  <span className="punch-in-tag">
                    🟢 In: {emp.punchIn || "09:00 AM"}
                  </span>
                  <span className="punch-out-tag">
                    🔴 Out: {emp.punchOut || "05:30 PM"}
                  </span>
                </div>
              </td>
              <td>
                <div><strong>{formatSalary(emp.salary)}</strong></div>
                <div style={{ marginTop: "4px" }}>
                  <button
                    onClick={() =>
                      onTogglePayment(
                        emp._id,
                        emp.paymentStatus === "Paid" ? "Pending" : "Paid"
                      )
                    }
                    className={`btn-pay-status ${
                      emp.paymentStatus === "Paid" ? "pay-paid" : "pay-pending"
                    }`}
                    title="Click to toggle Paid/Pending"
                  >
                    {emp.paymentStatus === "Paid" ? "✓ Paid" : "⏳ Due / Pending"}
                  </button>
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onOpenAttendance(emp)}
                    className="btn-action btn-attendance"
                    title="Mark Attendance & Punch In/Out Timings"
                  >
                    🕒 Gate Punch
                  </button>
                  <button
                    onClick={() => onViewIdCard(emp)}
                    className="btn-action btn-idcard"
                    title="View & Print Official Plant ID Card"
                  >
                    🪪 ID Card
                  </button>
                  <button
                    onClick={() => onViewPaySlip(emp)}
                    className="btn-action btn-slip"
                    title="Generate Monthly Pay Slip"
                  >
                    Pay Slip
                  </button>
                  <Link
                    to={`/employees/edit/${emp._id}`}
                    className="btn-action btn-edit"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(emp._id, emp.name)}
                    className="btn-action btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
