// src/routes/adminRoutes.js

const adminController = require("../api/auth/adminController");
const {
  authenticateJWT,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
// Import other admin controller functions as necessary

const router = require("express").Router();

router.get(
  "/users",
  authenticateJWT,
  authorizeAdmin,
  adminController.getAllUsers
);

router.get(
  "/users/:id",
  authenticateJWT,
  authorizeAdmin,
  adminController.getUserById
);

router.post("/create-admin", adminController.createAdmin);
// Login route should not use authenticateJWT middleware
router.post("/login", adminController.adminLogin);

// Protect routes below this line with middleware
router.use(authenticateJWT, authorizeAdmin);

// Example protected admin route
router.get("/admin/dashboard", (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

router.delete(
  "/users/:auth0UserId",
  authenticateJWT,
  authorizeAdmin,
  adminController.deleteUserById
);

// Add other admin routes as necessary

module.exports = router;
