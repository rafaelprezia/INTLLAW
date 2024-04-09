// src/api/auth/callbackController.js

const User = require("../../models/user"); // Import your User model

// Define your handleCallback function
exports.handleCallback = async (req, res) => {
  const auth0Id = req.params.auth0Id;

  try {
    // Fetch the user with the given Auth0 ID
    const user = await User.findOne({ auth0Id: auth0Id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Redirect the user to the specified website
    res.redirect(
      "https://rafaelpreziagomes.github.io/creative-box-website/index.html"
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error handling callback", error: error.message });
  }
};
