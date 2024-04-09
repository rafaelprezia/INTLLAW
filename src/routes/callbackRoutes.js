// add callback route

// Path: src/routes/callbackRoutes.js
const { Router } = require("express");
const jwtDecode = require("jwt-decode"); // npm install jwt-decode
const User = require("../models/user");
const { handleCallback } = require("../api/auth/callbackController");
const router = Router();

router.get("/callback/:auth0Id", handleCallback);

module.exports = router;
