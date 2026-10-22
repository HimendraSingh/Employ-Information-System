import React from "react";

const IdCardModal = ({ employee, onClose }) => {
  if (!employee) return null;

  const empIdShort = employee._id ? employee._id.slice(-6).toUpperCase() : "884120";
  const initials = employee.name
    ? employee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "EP";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card idcard-modal-container">
        <div className="idcard-modal-header">
          <h3>Official Plant Identity Pass</h3>
          <button onClick={onClose} className="btn-close-modal">
            &times;
          </button>
        </div>

        <div className="id-badge" id="printable-id-card">
          <div className="id-badge-clip-slot"></div>

          <div className="id-badge-header">
            <div className="id-badge-logo-mark">IFFCO</div>
            <div className="id-badge-org">
              <h4>INDIAN FARMERS FERTILISER COOP. LTD.</h4>
              <span>PHULPUR UNIT — PRAYAGRAJ (U.P.)</span>
            </div>
          </div>

          <div className="id-badge-strip">
            <span>OFFICIAL PLANT IDENTITY PASS</span>
          </div>

          <div className="id-badge-body">
            <div className="id-photo-wrapper">
              <div className="id-avatar-circle">
                <span className="id-initials">{initials}</span>
              </div>
              <span className="id-verified-chip">VERIFIED</span>
            </div>

            <div className="id-employee-details">
              <h2 className="id-name">{employee.name}</h2>
              <p className="id-designation">{employee.designation}</p>
              <div className="id-dept-pill">{employee.department}</div>

              <div className="id-info-grid">
                <div className="id-info-cell">
                  <span className="cell-label">EMPLOYEE ID</span>
                  <strong className="cell-value">IFC-PH-{empIdShort}</strong>
                </div>
                <div className="id-info-cell">
                  <span className="cell-label">ASSIGNED SHIFT</span>
                  <strong className="cell-value">{employee.shift || "General Shift"}</strong>
                </div>
                <div className="id-info-cell">
                  <span className="cell-label">CONTACT NO</span>
                  <strong className="cell-value">{employee.phone}</strong>
                </div>
                <div className="id-info-cell">
                  <span className="cell-label">PLANT ZONE</span>
                  <strong className="cell-value">Zone-A / Complex</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="id-badge-footer">
            <div className="id-barcode-graphic">
              <div className="barcode-bars">
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <span className="barcode-digits">*{employee._id}*</span>
            </div>
            <div className="id-signature-block">
              <div className="signature-line">Authorized Signatory</div>
              <span>Plant General Manager</span>
            </div>
          </div>
        </div>

        <div className="modal-actions id-modal-actions">
          <button onClick={handlePrint} className="btn-primary btn-print-id">
            🖨️ Print ID Card / Save PDF
          </button>
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdCardModal;
