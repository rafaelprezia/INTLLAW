//src/app.js

require("dotenv").config({
  path: "/Users/rafaelprezia/Desktop/StorageD/Development/INTLLAW/.env",
});
const ssoAuthRouter = require("./api/auth/ssoController");
const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const legalRoutes = require("./routes/legalRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Adjust the path as necessary
const callbackRoutes = require("./routes/callbackRoutes"); // Adjust the path as necessary
const superUserRoutes = require("./routes/superUserRoutes");

const app = express();
// Parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(ssoAuthRouter);
app.use("/admin", adminRoutes);
app.use("/auth", callbackRoutes);
app.use("/auth", userRoutes);
app.use("/root", superUserRoutes);
app.use("/stripe", paymentRoutes);
app.use(cors()); // This allows all cross-origin requests. You might want to configure it for specific origins.

module.exports = app;
