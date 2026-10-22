const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getAllEmployeesForExport,
  getEmployeeStats,
  getEmployeeById,
  updateEmployee,
  updateAttendance,
  updatePaymentStatus,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/stats", getEmployeeStats);
router.get("/export", getAllEmployeesForExport);

router.patch("/:id/attendance", updateAttendance);
router.patch("/:id/payment", updatePaymentStatus);

router.route("/").get(getAllEmployees).post(createEmployee);
router.route("/:id").get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
