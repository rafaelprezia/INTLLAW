//src/routes/userRoutes.js

const express = require("express");
const userController = require("../api/auth/userController");

const router = express.Router();

router.get("/user/:auth0Id", userController.getUserByAuth0Id);

router.delete("/user/:auth0Id", userController.deleteOwnAccount);

router.patch("/user/:auth0Id", userController.updateUserByAuth0Id);

module.exports = router;
