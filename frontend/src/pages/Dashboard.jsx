import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmployeeTable from "../components/EmployeeTable";
import PlantAnalytics from "../components/PlantAnalytics";
import PaySlipModal from "../components/PaySlipModal";
import AttendanceModal from "../components/AttendanceModal";
import IdCardModal from "../components/IdCardModal";
import { API_BASE_URL } from "../config";

const RENDER_BACKEND_URL = "https://employ-information-system.onrender.com";
const effectiveApiUrl = API_BASE_URL || RENDER_BACKEND_URL;

const departments = [
  "All Departments",
  "Production",
  "Systems",
  "IT Sector",
  "HR",
  "Finance",
  "Safety",
  "Store",
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedPaySlipEmployee, setSelectedPaySlipEmployee] = useState(null);
  const [selectedIdCardEmployee, setSelectedIdCardEmployee] = useState(null);
  const [selectedAttendanceEmployee, setSelectedAttendanceEmployee] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const savedAdmin = localStorage.getItem("admin");
  const admin = savedAdmin ? JSON.parse(savedAdmin) : { name: "Plant Administrator" };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${effectiveApiUrl}/api/employees/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Stats load warning:", error.message);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      let url = `${effectiveApiUrl}/api/employees?page=${currentPage}&limit=5`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (selectedDepartment && selectedDepartment !== "All Departments") {
        url += `&department=${encodeURIComponent(selectedDepartment)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees from server");
      }

      const data = await response.json();
      setEmployees(data.employees || []);
      setTotalPages(data.totalPages || 1);
      setTotalEmployees(data.totalEmployees || 0);

      fetchStats();
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, selectedDepartment, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput.trim());
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteEmployee = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete employee "${name}"? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${effectiveApiUrl}/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Failed to delete employee. Please try again.");
        return;
      }

      fetchEmployees();
    } catch (error) {
      alert("Error deleting employee: " + error.message);
    }
  };

  const handleTogglePaymentStatus = async (id, nextStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${effectiveApiUrl}/api/employees/${id}/payment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: nextStatus }),
      });

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Toggle payment status error:", error.message);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${effectiveApiUrl}/api/employees/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch export data");
      }

      const exportList = await response.json();
      if (!exportList || exportList.length === 0) {
        alert("No employees found to export.");
        setIsExporting(false);
        return;
      }

      const headers = [
        "Employee ID,Name,Email,Phone,Department,Designation,Shift,Attendance Status,Punch In (In-Time),Punch Out (Out-Time),Salary (INR),Payment Status,Joining Date",
      ];
      const rows = exportList.map((emp) => {
        const id = `"${emp._id}"`;
        const name = `"${emp.name.replace(/"/g, '""')}"`;
        const email = `"${emp.email}"`;
        const phone = `"${emp.phone}"`;
        const dept = `"${emp.department}"`;
        const desig = `"${emp.designation.replace(/"/g, '""')}"`;
        const shift = `"${emp.shift || "General Shift"}"`;
        const attendance = `"${emp.attendanceStatus || "Present"}"`;
        const punchIn = `"${emp.punchIn || "09:00 AM"}"`;
        const punchOut = `"${emp.punchOut || "05:30 PM"}"`;
        const salary = emp.salary;
        const payment = `"${emp.paymentStatus || "Paid"}"`;
        const joining = `"${new Date(emp.joiningDate).toLocaleDateString("en-IN")}"`;
        return [
          id,
          name,
          email,
          phone,
          dept,
          desig,
          shift,
          attendance,
          punchIn,
          punchOut,
          salary,
          payment,
          joining,
        ].join(",");
      });

      const csvContent = "\uFEFF" + [headers, ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `IFFCO_Phulpur_Employees_Roster_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error exporting CSV: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-logo-emblem">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="brand-titles">
            <h1>IFFCO Phulpur Fertilizer Complex</h1>
            <span>Employee Workforce & Gate Pass Portal</span>
          </div>
        </div>
        <div className="navbar-user">
          <div className="plant-health-chip">
            <span className="live-pulse-dot"></span>
            <span>Units 1 & 2 Active</span>
          </div>
          <span className="live-demo-badge">🟢 Live Access</span>
          <span className="user-role-badge">Plant Administrator</span>
        </div>
      </header>

      <div className="plant-ticker-bar">
        <div className="ticker-badge">
          <span className="ticker-icon">⚡</span> LIVE PLANT ADVISORY
        </div>
        <div className="ticker-text">
          <span>IFFCO Phulpur Industrial Complex • Ammonia-Urea Units Operating at Normal Load • Mandatory PPE & Gate Badge Required • Safety Standard ISO 14001:2015</span>
        </div>
        <div className="ticker-location">
          <span>Prayagraj (U.P.)</span>
        </div>
      </div>

      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h2>Employee Roster & Attendance Control</h2>
            <p className="subtitle">
              Total registered workforce: <strong>{totalEmployees}</strong>
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="btn-toggle-analytics"
            >
              {showAnalytics ? "📊 Hide Plant Analytics" : "📊 Show Plant Analytics"}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="btn-export"
            >
              {isExporting ? "Exporting..." : "📥 Export Roster to CSV"}
            </button>
            <Link to="/employees/add" className="btn-add">
              + Add Employee
            </Link>
          </div>
        </div>

        {showAnalytics && <PlantAnalytics stats={stats} />}

        <div className="filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn-clear"
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            )}
          </form>

          <div className="department-filter">
            <label htmlFor="dept-select">Department:</label>
            <select
              id="dept-select"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="dept-select"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dept-quick-pills">
          <span className="pills-label">Filter Department:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              className={`pill-btn ${selectedDepartment === dept ? "pill-active" : ""}`}
              onClick={() => {
                setSelectedDepartment(dept);
                setCurrentPage(1);
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="state-card loading-state">
            <div className="spinner"></div>
            <p>Loading employee records, please wait...</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="state-card error-state">
            <p className="error-text">⚠️ {errorMessage}</p>
            <button onClick={fetchEmployees} className="btn-retry">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !errorMessage && employees.length === 0 && (
          <div className="state-card empty-state">
            <p>No employees found matching your criteria.</p>
          </div>
        )}

        {!isLoading && !errorMessage && employees.length > 0 && (
          <>
            <EmployeeTable
              employees={employees}
              onDelete={handleDeleteEmployee}
              onViewPaySlip={(emp) => setSelectedPaySlipEmployee(emp)}
              onViewIdCard={(emp) => setSelectedIdCardEmployee(emp)}
              onOpenAttendance={(emp) => setSelectedAttendanceEmployee(emp)}
              onTogglePayment={handleTogglePaymentStatus}
            />

            <div className="pagination-bar">
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>

              <div className="pagination-buttons">
                <button
                  className="btn-page"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  &larr; Previous
                </button>
                <button
                  className="btn-page"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </>
        )}

        {selectedPaySlipEmployee && (
          <PaySlipModal
            employee={selectedPaySlipEmployee}
            onClose={() => setSelectedPaySlipEmployee(null)}
          />
        )}

        {selectedIdCardEmployee && (
          <IdCardModal
            employee={selectedIdCardEmployee}
            onClose={() => setSelectedIdCardEmployee(null)}
          />
        )}

        {selectedAttendanceEmployee && (
          <AttendanceModal
            employee={selectedAttendanceEmployee}
            onClose={() => setSelectedAttendanceEmployee(null)}
            onUpdated={fetchEmployees}
          />
        )}
      </main>

      <footer className="plant-footer">
        <div className="footer-container">
          <div className="footer-left">
            <strong>Indian Farmers Fertiliser Cooperative Limited (IFFCO)</strong>
            <p>Phulpur Fertilizer Complex, Ghiyanagar, Prayagraj, Uttar Pradesh - 212404 • ISO 9001:2015 & ISO 14001:2015 Certified</p>
          </div>
          <div className="footer-right">
            <span>Plant Workforce Management & Gate Pass System v2.4</span>
            <p>
              Render Live API:{" "}
              <a
                href={RENDER_BACKEND_URL}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#a7f3d0", textDecoration: "underline" }}
              >
                {RENDER_BACKEND_URL}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
