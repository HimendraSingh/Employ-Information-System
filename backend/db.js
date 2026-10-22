const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Admin = require("./models/Admin");
const Employee = require("./models/Employee");

let localMongoServer = null;

const seedInitialData = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("plantpassword123", salt);

      await Admin.create({
        name: "IFFCO Admin",
        email: "admin@iffco.in",
        password: hashedPassword,
      });
      console.log("Default admin created: admin@iffco.in / plantpassword123");
    }

    const employeeCount = await Employee.countDocuments();
    if (employeeCount === 0) {
      await Employee.create([
        {
          name: "Ramesh Kumar",
          email: "ramesh.kumar@iffco.in",
          phone: "9876543210",
          department: "Production",
          designation: "Plant Engineer",
          salary: 65000,
        },
        {
          name: "Pooja Sharma",
          email: "pooja.sharma@iffco.in",
          phone: "9876501234",
          department: "Systems",
          designation: "Network Engineer",
          salary: 58000,
        },
        {
          name: "Vikram Singh",
          email: "vikram.singh@iffco.in",
          phone: "9876598765",
          department: "Safety",
          designation: "Safety Officer",
          salary: 48000,
        },
      ]);
      console.log("Initial sample employees seeded.");
    }
  } catch (error) {
    console.error("Seeding warning:", error.message);
  }
};

const connectDB = async () => {
  try {
    let connectionUri = process.env.MONGO_URI;

    const isPlaceholder =
      !connectionUri ||
      connectionUri.includes("your_mongodb_atlas") ||
      (!connectionUri.startsWith("mongodb://") && !connectionUri.startsWith("mongodb+srv://"));

    if (isPlaceholder) {
      const dataDirectory = path.join(__dirname, "data");
      if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory, { recursive: true });
      }

      localMongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dataDirectory,
          storageEngine: "wiredTiger",
        },
      });

      connectionUri = localMongoServer.getUri();
      console.log("Local persistent database initialized.");
    }

    const connection = await mongoose.connect(connectionUri);
    console.log(`Database connected: ${connection.connection.host}`);

    await seedInitialData();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  if (localMongoServer) {
    await localMongoServer.stop();
  }
  process.exit(0);
});

module.exports = connectDB;
