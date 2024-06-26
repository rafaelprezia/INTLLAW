// src/api/auth/ssoController.js
const { Router } = require("express");
const { auth } = require("express-openid-connect");
const { requiresAuth } = require("express-openid-connect");
const User = require("../../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const router = Router();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "9DqqBfCCq8f-Ayxjeo7H5E_xuEsNUax63otgg3XNbWqar4SGGP3Fb4CUTmYgu4rk",
  baseURL: "http://localhost:3000",
  clientID: "7f8P26uwamhzz8psBnPJxL9mdGwtLIJs",
  issuerBaseURL: "https://dev-rutnsxpydci36ykm.us.auth0.com",
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
router.use(auth(config));

router.get("/profile", requiresAuth(), async (req, res) => {
  // Extract user data from the Auth0 profile
  const userData = {
    auth0Id: req.oidc.user.sub,
    givenName: req.oidc.user.given_name,
    familyName: req.oidc.user.family_name,
    nickname: req.oidc.user.nickname,
    name: req.oidc.user.name,
    picture: req.oidc.user.picture,
    locale: req.oidc.user.locale,
    updatedAt: req.oidc.user.updated_at,
    email: req.oidc.user.email,
    emailVerified: req.oidc.user.email_verified,
  };

  try {
    // Check if the user already exists
    let user = await User.findOne({ auth0Id: userData.auth0Id });

    // Update the user profile in the database,
    // or create a new one if it doesn't exist
    user = await User.findOneAndUpdate(
      { auth0Id: userData.auth0Id },
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send the user profile in the response
    res.json({ message: "User profile stored successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving user to database");
  }
});

// req.isAuthenticated is provided from the auth router
router.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

module.exports = router;
