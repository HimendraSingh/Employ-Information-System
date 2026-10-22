require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Admin = require("../models/Admin");
const Employee = require("../models/Employee");

let testServerInstance = null;

const getTestDbUri = async () => {
  if (process.env.MONGO_URI_TEST) {
    return process.env.MONGO_URI_TEST;
  }
  if (process.env.MONGO_URI && process.env.MONGO_URI.includes(".mongodb.net/")) {
    return process.env.MONGO_URI.replace(/\.mongodb\.net\/([^?]*)/, ".mongodb.net/iffco_test_db");
  }
  testServerInstance = await MongoMemoryServer.create();
  return testServerInstance.getUri();
};

describe("Employee Information System - Backend API Tests", () => {
  let authToken = "";
  let createdEmployeeId = "";

  beforeAll(async () => {
    const testUri = await getTestDbUri();
    await mongoose.connect(testUri);

    await Admin.deleteMany({ email: "tester@test.com" });
    await Employee.deleteMany({ email: "test.worker@test.com" });
  });

  afterAll(async () => {
    await Admin.deleteMany({ email: "tester@test.com" });
    await Employee.deleteMany({ email: "test.worker@test.com" });
    await mongoose.connection.close();
    if (testServerInstance) {
      await testServerInstance.stop();
    }
  });

  it("1. should register a new admin successfully and return a token", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Admin",
        email: "tester@test.com",
        password: "password123",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.admin.email).toBe("tester@test.com");

    authToken = response.body.token;
  });

  it("2. should return 400 when logging in with a wrong password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "tester@test.com",
        password: "wrongpassword123",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("3. should fetch employees directly without requiring a token", async () => {
    const response = await request(app).get("/api/employees");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("employees");
  });

  it("4. should add a new employee when a valid token is provided", async () => {
    const response = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Worker",
        email: "test.worker@test.com",
        phone: "9876543210",
        department: "Safety",
        designation: "Safety Officer",
        salary: 45000,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.employee).toHaveProperty("_id");
    expect(response.body.employee.name).toBe("Test Worker");

    createdEmployeeId = response.body.employee._id;
  });

  it("5. should delete the employee when given a valid ID and token", async () => {
    const response = await request(app)
      .delete(`/api/employees/${createdEmployeeId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Employee deleted successfully");
  });
});
