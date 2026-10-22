const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      designation,
      shift,
      attendanceStatus,
      punchIn,
      punchOut,
      paymentStatus,
      joiningDate,
      salary,
    } = req.body;

    if (!name || !email || !phone || !department || !designation || salary === undefined) {
      return res.status(400).json({
        message: "Please fill in all required fields: name, email, phone, department, designation, salary",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (Number(salary) < 0) {
      return res.status(400).json({
        message: "Salary cannot be negative",
      });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        message: "An employee with this email already exists",
      });
    }

    const newEmployee = await Employee.create({
      name,
      email,
      phone,
      department,
      designation,
      shift: shift || "General Shift",
      attendanceStatus: attendanceStatus || "Present",
      punchIn: punchIn || "09:00 AM",
      punchOut: punchOut || "05:30 PM",
      paymentStatus: paymentStatus || "Paid",
      joiningDate: joiningDate || Date.now(),
      salary,
    });

    return res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const { search, department, page, limit } = req.query;

    const filterQuery = {};

    if (search) {
      filterQuery.name = { $regex: search, $options: "i" };
    }

    if (department) {
      filterQuery.department = department;
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 5;
    const skipCount = (pageNumber - 1) * pageSize;

    const totalEmployees = await Employee.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalEmployees / pageSize) || 1;

    const employees = await Employee.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(pageSize);

    return res.status(200).json({
      totalEmployees,
      totalPages,
      currentPage: pageNumber,
      limit: pageSize,
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

const getAllEmployeesForExport = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to export employees",
      error: error.message,
    });
  }
};

const getEmployeeStats = async (req, res) => {
  try {
    const employees = await Employee.find();
    const totalEmployees = employees.length;

    let totalSalaryBudget = 0;
    const departmentCounts = {
      Production: 0,
      Systems: 0,
      "IT Sector": 0,
      HR: 0,
      Finance: 0,
      Safety: 0,
      Store: 0,
    };

    const shiftCounts = {
      "Shift A (Morning)": 0,
      "Shift B (Evening)": 0,
      "Shift C (Night)": 0,
      "General Shift": 0,
    };

    const attendanceCounts = {
      Present: 0,
      Absent: 0,
      "On Leave": 0,
      "Half Day": 0,
    };

    const paymentCounts = {
      Paid: 0,
      Pending: 0,
    };

    employees.forEach((emp) => {
      totalSalaryBudget += Number(emp.salary) || 0;

      if (departmentCounts[emp.department] !== undefined) {
        departmentCounts[emp.department]++;
      }

      const shiftKey = emp.shift || "General Shift";
      if (shiftCounts[shiftKey] !== undefined) {
        shiftCounts[shiftKey]++;
      } else {
        shiftCounts["General Shift"]++;
      }

      const attendanceKey = emp.attendanceStatus || "Present";
      if (attendanceCounts[attendanceKey] !== undefined) {
        attendanceCounts[attendanceKey]++;
      } else {
        attendanceCounts["Present"]++;
      }

      const paymentKey = emp.paymentStatus || "Paid";
      if (paymentCounts[paymentKey] !== undefined) {
        paymentCounts[paymentKey]++;
      } else {
        paymentCounts["Paid"]++;
      }
    });

    const averageSalary = totalEmployees > 0 ? Math.round(totalSalaryBudget / totalEmployees) : 0;

    return res.status(200).json({
      totalEmployees,
      totalSalaryBudget,
      averageSalary,
      departmentCounts,
      shiftCounts,
      attendanceCounts,
      paymentCounts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate plant statistics",
      error: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid employee ID format",
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      department,
      designation,
      shift,
      attendanceStatus,
      punchIn,
      punchOut,
      paymentStatus,
      joiningDate,
      salary,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid employee ID format",
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (salary !== undefined && Number(salary) < 0) {
      return res.status(400).json({
        message: "Salary cannot be negative",
      });
    }

    if (email) {
      const emailTaken = await Employee.findOne({ email, _id: { $ne: id } });
      if (emailTaken) {
        return res.status(400).json({
          message: "Email is already taken by another employee",
        });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        department,
        designation,
        shift,
        attendanceStatus,
        punchIn,
        punchOut,
        paymentStatus,
        joiningDate,
        salary,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendanceStatus, punchIn, punchOut } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid employee ID format",
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { attendanceStatus, punchIn, punchOut },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Attendance updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid employee ID format",
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        lastPaymentDate: paymentStatus === "Paid" ? Date.now() : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Salary payment status updated",
      employee: updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid employee ID format",
      });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
      employeeId: id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getAllEmployeesForExport,
  getEmployeeStats,
  getEmployeeById,
  updateEmployee,
  updateAttendance,
  updatePaymentStatus,
  deleteEmployee,
};
