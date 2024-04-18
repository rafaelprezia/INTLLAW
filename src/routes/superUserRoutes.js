// src/routes/superUserRoutes.js
const express = require("express");
const router = express.Router();
const superUserController = require("../api/auth/superUserController");
const superUserMiddleware = require("../middleware/superUserMiddleware");

router.post("/createSuperUser", superUserController.createSuperUser);

router.post(
  "/adminLink",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  superUserController.createAdminLink
);

router.get(
  "/createAdmin/:secretKey",
  superUserController.serveAdminCreationForm
);

router.post("/createAdmin/:secretKey", superUserController.createAdmin);

router.post("/login", superUserController.superUserLogin);

module.exports = router;
