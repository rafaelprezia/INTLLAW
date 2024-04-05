// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../api/auth/adminController"); // Adjust the path as necessary
const {
  authenticateJWT,
  authorizeAdmin,
} = require("../middleware/authMiddleware"); // Adjust the path as necessary

// Endpoint to update a user's role to 'admin'
router.post(
  "/make-admin/:userId",
  authenticateJWT,
  authorizeAdmin,
  adminController.makeAdmin
);

module.exports = router;
