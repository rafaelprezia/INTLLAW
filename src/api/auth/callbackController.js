// src/api/auth/callbackController.js
const { Router } = require("express");
const jwtDecode = require("jwt-decode"); // npm install jwt-decode
const User = require("../models/user");

const router = Router();

router.get("/callback", (req, res) => {
  const { id_token } = req.query; // Or however you are receiving the ID token

  // Decode the ID token to get user data
  const userData = jwtDecode(id_token);

  // Store or update user data in your database
  User.findOneAndUpdate(
    { auth0Id: userData.sub },
    userData,
    { upsert: true, new: true, setDefaultsOnInsert: true },
    (err, user) => {
      if (err) {
        console.error("Error saving user to database", err);
        return res.status(500).send("Internal Server Error");
      }

      // Set up session and cookie here

      // Redirect to the user's dashboard or home page
      res.redirect("/dashboard");
    }
  );
});

module.exports = router;
