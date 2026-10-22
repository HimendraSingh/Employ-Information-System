import React, { useState } from "react";
import { API_BASE_URL } from "../config";

const AttendanceModal = ({ employee, onClose, onUpdated }) => {
  if (!employee) return null;

  const [attendanceStatus, setAttendanceStatus] = useState(
    employee.attendanceStatus || "Present"
  );
  const [punchIn, setPunchIn] = useState(employee.punchIn || "09:00 AM");
  const [punchOut, setPunchOut] = useState(employee.punchOut || "05:30 PM");
  const [paymentStatus, setPaymentStatus] = useState(
    employee.paymentStatus || "Paid"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const getCurrentTimeString = () => {
    return new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSetCurrentIn = () => {
    setPunchIn(getCurrentTimeString());
  };

  const handleSetCurrentOut = () => {
    setPunchOut(getCurrentTimeString());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorText("");

    try {
      const token = localStorage.getItem("token");

      const attendanceRes = await fetch(
        `${API_BASE_URL}/api/employees/${employee._id}/attendance`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attendanceStatus,
            punchIn,
            punchOut,
          }),
        }
      );

      if (!attendanceRes.ok) {
        throw new Error("Failed to update attendance");
      }

      const paymentRes = await fetch(
        `${API_BASE_URL}/api/employees/${employee._id}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentStatus }),
        }
      );

      if (!paymentRes.ok) {
        throw new Error("Failed to update payment status");
      }

      onUpdated();
      onClose();
    } catch (error) {
      setErrorText(error.message || "Failed to update record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card attendance-modal-card">
        <div className="payslip-header">
          <div>
            <h3 style={{ margin: 0, color: "#0d5c3a" }}>Daily Attendance & Gate Punch Clock</h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
              Worker: <strong>{employee.name}</strong> ({employee.department} - {employee.shift || "General Shift"})
            </p>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            &times;
          </button>
        </div>

        {errorText && <div className="error-alert">{errorText}</div>}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="att-status">Today's Attendance Status</label>
            <select
              id="att-status"
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
            >
              <option value="Present">Present (Active in Plant)</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Approved Leave</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="punch-in">In-Time (Gate Punch In)</label>
              <div className="punch-input-wrapper">
                <input
                  id="punch-in"
                  type="text"
                  value={punchIn}
                  onChange={(e) => setPunchIn(e.target.value)}
                  placeholder="e.g. 08:55 AM"
                />
                <button
                  type="button"
                  onClick={handleSetCurrentIn}
                  className="btn-punch-now"
                >
                  Set Now
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="punch-out">Out-Time (Gate Punch Out)</label>
              <div className="punch-input-wrapper">
                <input
                  id="punch-out"
                  type="text"
                  value={punchOut}
                  onChange={(e) => setPunchOut(e.target.value)}
                  placeholder="e.g. 05:30 PM"
                />
                <button
                  type="button"
                  onClick={handleSetCurrentOut}
                  className="btn-punch-now"
                >
                  Set Now
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pay-status">Salary Disbursement Status</label>
            <select
              id="pay-status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Paid">Paid (Salary Disbursed)</option>
              <option value="Pending">Pending (Payment Due)</option>
            </select>
          </div>

          <div className="modal-actions" style={{ marginTop: "24px" }}>
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;
