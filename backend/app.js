const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.get("/api/health", (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      message: "Server is healthy and running smoothly",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong with the health check",
    });
  }
});

module.exports = app;
