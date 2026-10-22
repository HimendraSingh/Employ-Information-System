import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmployeeTable from "../components/EmployeeTable";
import PlantAnalytics from "../components/PlantAnalytics";
import PaySlipModal from "../components/PaySlipModal";
import AttendanceModal from "../components/AttendanceModal";
import IdCardModal from "../components/IdCardModal";
import { API_BASE_URL } from "../config";

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

const mockEmployeesList = [
  {
    _id: "1",
    employeeId: "EMP-101",
    name: "Ramesh Sharma",
    email: "r.sharma@iffco.in",
    department: "Systems",
    designation: "Senior Plant Engineer",
    shift: "Shift A Morning",
    salary: 68000,
    joiningDate: "2021-03-15",
    status: "Active",
  },
  {
    _id: "2",
    employeeId: "EMP-102",
    name: "Amit Patel",
    email: "a.patel@iffco.in",
    department: "IT Sector",
    designation: "Systems Analyst",
    shift: "General Shift",
    salary: 62000,
    joiningDate: "2020-07-01",
    status: "Active",
  },
  {
    _id: "3",
    employeeId: "EMP-103",
    name: "Sunita Verma",
    email: "s.verma@iffco.in",
    department: "HR",
    designation: "HR Officer",
    shift: "General Shift",
    salary: 54000,
    joiningDate: "2022-11-10",
    status: "Active",
  },
  {
    _id: "4",
    employeeId: "EMP-104",
    name: "Vikas Singh",
    email: "v.singh@iffco.in",
    department: "Finance",
    designation: "Accounts Officer",
    shift: "Shift B Evening",
    salary: 58000,
    joiningDate: "2022-04-12",
    status: "Active",
  },
  {
    _id: "5",
    employeeId: "EMP-105",
    name: "Pooja Mishra",
    email: "p.mishra@iffco.in",
    department: "Safety",
    designation: "Safety Officer",
    shift: "Shift C Night",
    salary: 59000,
    joiningDate: "2023-01-15",
    status: "Active",
  },
];

const mockStatsData = {
  totalEmployees: 5,
  totalPayroll: 301000,
  monthlyPayroll: 301000,
  totalSalary: 301000,
  averageSalary: 60200,
  activeDivisions: 5,
  presentCount: 5,
  absentCount: 0,
  leaveCount: 0,
  paidCount: 5,
  dueCount: 0,
  attendance: {
    present: 5,
    absent: 0,
    leave: 0,
  },
  payroll: {
    total: 301000,
    paid: 5,
    due: 0,
  },
  departmentDistribution: [
    { department: "Production", _id: "Production", count: 1, percentage: 20 },
    { department: "Systems", _id: "Systems", count: 1, percentage: 20 },
    { department: "IT Sector", _id: "IT Sector", count: 1, percentage: 20 },
    { department: "Safety", _id: "Safety", count: 1, percentage: 20 },
    { department: "HR", _id: "HR", count: 1, percentage: 20 },
    { department: "Finance", _id: "Finance", count: 0, percentage: 0 },
    { department: "Store", _id: "Store", count: 0, percentage: 0 },
  ],
  shiftDistribution: [
    { shift: "Shift A (Morning 06:00 - 14:00)", _id: "Shift A Morning", count: 1 },
    { shift: "Shift B (Evening 14:00 - 22:00)", _id: "Shift B Evening", count: 1 },
    { shift: "Shift C (Night 22:00 - 06:00)", _id: "Shift C Night", count: 1 },
    { shift: "General Shift (09:00 - 17:30)", _id: "General Shift", count: 2 },
  ],
  shifts: {
    morning: 1,
    evening: 1,
    night: 1,
    general: 2,
  },
  departments: {
    Production: 1,
    Systems: 1,
    "IT Sector": 1,
    Safety: 1,
    HR: 1,
    Finance: 0,
    Store: 0,
  },
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

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
      const response = await fetch(`${API_BASE_URL}/api/employees/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      } else {
        throw new Error("Stats request failed");
      }
    } catch (error) {
      console.warn("Backend offline, loading fallback stats:", error.message);
      setStats(mockStatsData);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        department: selectedDepartment === "All Departments" ? "" : selectedDepartment,
      });

      const response = await fetch(`${API_BASE_URL}/api/employees?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || data);
        setTotalEmployees(data.totalEmployees || (Array.isArray(data) ? data.length : 0));
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error("Employees request failed");
      }
    } catch (error) {
      console.warn("Backend offline, loading fallback employees list:", error.message);
      let filtered = [...mockEmployeesList];

      if (selectedDepartment !== "All Departments") {
        filtered = filtered.filter((emp) => emp.department === selectedDepartment);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setEmployees(filtered);
      setTotalEmployees(filtered.length);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, selectedDepartment]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept);
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const headers = ["Employee ID,Name,Email,Department,Designation,Shift,Salary,Joining Date"];
      const rows = employees.map(
        (e) =>
          `"${e.employeeId || ""}","${e.name}","${e.email}","${e.department}","${e.designation || ""}","${e.shift}","${e.salary}","${e.joiningDate?.split("T")[0] || ""}"`
      );
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "IFFCO_Phulpur_Employees.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="brand-section">
          <h2>IFFCO Phulpur Unit</h2>
          <span className="badge">Employee Information System</span>
        </div>
        <div className="user-controls">
          <span className="welcome-text">Logged in as: <strong>{admin.name}</strong></span>
          <button className="btn-secondary" onClick={() => setShowAnalytics(!showAnalytics)}>
            {showAnalytics ? "Hide Plant Analytics" : "Show Plant Analytics"}
          </button>
          <button className="btn-export" onClick={handleExportCSV} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Analytics Section */}
      {showAnalytics && stats && (
        <PlantAnalytics stats={stats} />
      )}

      {/* Control Bar: Search & Departments */}
      <div className="control-bar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>

        <div className="department-pills">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`pill ${selectedDepartment === dept ? "active" : ""}`}
              onClick={() => handleDepartmentChange(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        onViewPaySlip={(emp) => setSelectedPaySlipEmployee(emp)}
        onViewAttendance={(emp) => setSelectedAttendanceEmployee(emp)}
        onViewIdCard={(emp) => setSelectedIdCardEmployee(emp)}
        onRefresh={fetchEmployees}
      />

      {/* Modals */}
      {selectedPaySlipEmployee && (
        <PaySlipModal
          employee={selectedPaySlipEmployee}
          onClose={() => setSelectedPaySlipEmployee(null)}
        />
      )}
      {selectedAttendanceEmployee && (
        <AttendanceModal
          employee={selectedAttendanceEmployee}
          onClose={() => setSelectedAttendanceEmployee(null)}
        />
      )}
      {selectedIdCardEmployee && (
        <IdCardModal
          employee={selectedIdCardEmployee}
          onClose={() => setSelectedIdCardEmployee(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
