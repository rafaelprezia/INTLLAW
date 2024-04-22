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

router.get(
  "/users",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  superUserController.getAllUsers
);

router.get(
  "/users/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  superUserController.getUserById
);

router.delete(
  "/users/:auth0UserId",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  superUserController.deleteUserById
);

router.get(
  "/admins",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  superUserController.getAllAdmins
);

router.get(
  "/admins/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  superUserController.getAdminById
);

router.delete(
  "/admins/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  superUserController.deleteAdminById
);

module.exports = router;
