const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const legalRoutes = require("./routes/legalRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Import middleware
const { authMiddleware } = require("./middleware/authMiddleware");

const { mongoURI } = require("./config/dbConfig"); // Make sure the path is correct

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://rafaelprezia:Serafina112006@intllaw.tiinkq0.mongodb.net/?retryWrites=true&w=majority&appName=INTLLAW"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

const app = express();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
