// src/routes/adminRoutes.js

const adminController = require("../api/auth/adminController");
const {
  authenticateJWT,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
// Import other admin controller functions as necessary

const router = require("express").Router();

router.post("/login", adminController.adminLogin);

// Protect routes below this line with middleware
router.use(authenticateJWT, authorizeAdmin);

// Example protected admin route
router.get("/admin/dashboard", (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

router.patch(
  "/users/transform-user/:auth0UserId",
  authenticateJWT,
  authorizeAdmin,
  adminController.transformUserToWorker
);

router.get(
  "/users/workers/:adminId",
  authenticateJWT,
  authorizeAdmin,
  adminController.getWorkersByAdminId
);

router.get(
  "/users/worker/:auth0UserId",
  authenticateJWT,
  authorizeAdmin,
  adminController.getWorkerByAdminIdAndUserId
);

// Add other admin routes as necessary

module.exports = router;
