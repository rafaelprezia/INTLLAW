//src/app.js

require("dotenv").config({
  path: "C:/Users/raffp/Levi Ducci/Levi Ducci - INTLLAW/Development/Platform/.env",
});
const ssoAuthRouter = require("./api/auth/ssoController");

// Other middlewares and configurations...

// Use the auth router from ssoController.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { mongoURI } = require("./config/dbConfig");

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

// ... other imports and app setup ...

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(mongoURI, err));

const app = express();
app.use(express.json());
app.use(ssoAuthRouter);
app.use("/admin", adminRoutes);
app.use("/auth", callbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

//  "mongodb+srv://rafaelprezia:Serafina112006@intllaw.tiinkq0.mongodb.net/?retryWrites=true&w=majority&appName=INTLLAW"
