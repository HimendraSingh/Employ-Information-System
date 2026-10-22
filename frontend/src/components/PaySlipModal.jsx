import React from "react";

const PaySlipModal = ({ employee, onClose }) => {
  if (!employee) return null;

  const salary = Number(employee.salary) || 0;
  const basicPay = Math.round(salary * 0.5);
  const hra = Math.round(salary * 0.2);
  const da = Math.round(salary * 0.2);
  const conveyance = Math.round(salary * 0.1);
  const grossEarnings = basicPay + hra + da + conveyance;

  const pfDeduction = Math.round(basicPay * 0.12);
  const professionalTax = 200;
  const totalDeductions = pfDeduction + professionalTax;
  const netPay = grossEarnings - totalDeductions;

  const currentMonthYear = new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card payslip-card">
        <div className="payslip-header">
          <div className="payslip-branding">
            <h2>INDIAN FARMERS FERTILISER COOPERATIVE LIMITED</h2>
            <p>Phulpur Unit, Ghiyanagar, Prayagraj, Uttar Pradesh - 212404</p>
            <h3>MONTHLY SALARY SLIP — {currentMonthYear.toUpperCase()}</h3>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            &times;
          </button>
        </div>

        <div className="payslip-info-grid">
          <div>
            <strong>Employee Name:</strong> {employee.name}
          </div>
          <div>
            <strong>Employee ID:</strong> {employee._id.slice(-8).toUpperCase()}
          </div>
          <div>
            <strong>Department:</strong> {employee.department}
          </div>
          <div>
            <strong>Designation:</strong> {employee.designation}
          </div>
          <div>
            <strong>Assigned Shift:</strong> {employee.shift || "General Shift"}
          </div>
          <div>
            <strong>Joining Date:</strong>{" "}
            {new Date(employee.joiningDate).toLocaleDateString("en-IN")}
          </div>
        </div>

        <div className="payslip-tables-row">
          <div className="payslip-table-box">
            <h4>EARNINGS</h4>
            <table className="slip-table">
              <tbody>
                <tr>
                  <td>Basic Pay (50%)</td>
                  <td className="text-right">₹{basicPay.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>House Rent Allowance (HRA 20%)</td>
                  <td className="text-right">₹{hra.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>Dearness Allowance (DA 20%)</td>
                  <td className="text-right">₹{da.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>Plant & Conveyance Allowance (10%)</td>
                  <td className="text-right">₹{conveyance.toLocaleString("en-IN")}</td>
                </tr>
                <tr className="slip-total-row">
                  <td><strong>Gross Earnings</strong></td>
                  <td className="text-right"><strong>₹{grossEarnings.toLocaleString("en-IN")}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="payslip-table-box">
            <h4>DEDUCTIONS</h4>
            <table className="slip-table">
              <tbody>
                <tr>
                  <td>Provident Fund (PF 12%)</td>
                  <td className="text-right">₹{pfDeduction.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>Professional Tax (PT)</td>
                  <td className="text-right">₹{professionalTax.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>Plant Safety Welfare Fund</td>
                  <td className="text-right">₹0</td>
                </tr>
                <tr>
                  <td>Income Tax (TDS)</td>
                  <td className="text-right">₹0</td>
                </tr>
                <tr className="slip-total-row">
                  <td><strong>Total Deductions</strong></td>
                  <td className="text-right"><strong>₹{totalDeductions.toLocaleString("en-IN")}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="payslip-net-box">
          <div>
            <span>Net Take-Home Salary:</span>
            <h3>₹{netPay.toLocaleString("en-IN")}</h3>
          </div>
          <p className="confidential-text">
            * This is a computer-generated salary slip of IFFCO Phulpur Unit and does not require a physical signature.
          </p>
        </div>

        <div className="modal-actions">
          <button onClick={handlePrint} className="btn-primary">
            🖨️ Print / Save PDF
          </button>
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaySlipModal;
