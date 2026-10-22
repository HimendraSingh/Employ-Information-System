import React from "react";

const PlantAnalytics = ({ stats }) => {
  if (!stats) return null;

  const {
    totalEmployees,
    totalSalaryBudget,
    averageSalary,
    departmentCounts,
    shiftCounts,
    attendanceCounts,
    paymentCounts,
  } = stats;

  const departmentsList = [
    { name: "Production", color: "#0284c7" },
    { name: "Systems", color: "#9333ea" },
    { name: "IT Sector", color: "#6366f1" },
    { name: "Safety", color: "#dc2626" },
    { name: "HR", color: "#d97706" },
    { name: "Finance", color: "#16a34a" },
    { name: "Store", color: "#ea580c" },
  ];

  return (
    <div className="analytics-section">
      <div className="stat-cards-grid">
        <div className="stat-card">
          <span className="stat-label">Total Plant Workforce</span>
          <h3 className="stat-value">{totalEmployees}</h3>
          <span className="stat-sub">Active On-Roll Workers</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Today's Plant Attendance</span>
          <h3 className="stat-value" style={{ color: "#16a34a" }}>
            {attendanceCounts ? attendanceCounts.Present || 0 : 0} / {totalEmployees}
          </h3>
          <span className="stat-sub">
            Absent: {attendanceCounts ? attendanceCounts.Absent || 0 : 0} | Leave:{" "}
            {attendanceCounts ? attendanceCounts["On Leave"] || 0 : 0}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Monthly Payroll Budget</span>
          <h3 className="stat-value">₹{Number(totalSalaryBudget || 0).toLocaleString("en-IN")}</h3>
          <span className="stat-sub">
            Paid: {paymentCounts ? paymentCounts.Paid || 0 : 0} | Due:{" "}
            {paymentCounts ? paymentCounts.Pending || 0 : 0}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Average Monthly Salary</span>
          <h3 className="stat-value">₹{Number(averageSalary || 0).toLocaleString("en-IN")}</h3>
          <span className="stat-sub">Across All Plant Units</span>
        </div>
      </div>

      <div className="analytics-details-grid">
        <div className="distribution-card">
          <h4>Department-Wise Workforce Distribution</h4>
          <div className="bars-container">
            {departmentsList.map((dept) => {
              const count = departmentCounts ? departmentCounts[dept.name] || 0 : 0;
              const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;

              return (
                <div key={dept.name} className="bar-row">
                  <div className="bar-info">
                    <span className="dept-name">{dept.name}</span>
                    <span className="dept-count">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: dept.color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="distribution-card">
          <h4>Gate Attendance & Shift Overview</h4>
          <div className="shifts-list">
            <div className="shift-item">
              <div>
                <strong>Shift A (Morning 06:00 - 14:00)</strong>
                <p>Morning plant operations team</p>
              </div>
              <span className="shift-badge">
                {shiftCounts ? shiftCounts["Shift A (Morning)"] || 0 : 0} Staff
              </span>
            </div>

            <div className="shift-item">
              <div>
                <strong>Shift B (Evening 14:00 - 22:00)</strong>
                <p>Afternoon to evening plant team</p>
              </div>
              <span className="shift-badge">
                {shiftCounts ? shiftCounts["Shift B (Evening)"] || 0 : 0} Staff
              </span>
            </div>

            <div className="shift-item">
              <div>
                <strong>Shift C (Night 22:00 - 06:00)</strong>
                <p>Continuous chemical process night team</p>
              </div>
              <span className="shift-badge">
                {shiftCounts ? shiftCounts["Shift C (Night)"] || 0 : 0} Staff
              </span>
            </div>

            <div className="shift-item">
              <div>
                <strong>General Shift (09:00 - 17:30)</strong>
                <p>Systems, HR, Finance, Store & Admin</p>
              </div>
              <span className="shift-badge">
                {shiftCounts ? shiftCounts["General Shift"] || 0 : 0} Staff
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantAnalytics;
