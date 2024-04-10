//src/api/auth/userController.js

const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.getUserByAuth0Id = async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

async function getAuth0ManagementApiToken() {
  const tokenUrl = "https://dev-rutnsxpydci36ykm.us.auth0.com/oauth/token";
  const clientId = "pN23PZBvPvUVo79U9souO4OYAuAx9vnc";
  const clientSecret =
    "uEU-JRODWzPqNI-oYYy36S8CJFaSa1rxl2I6_Vm_mMGRdzYPwR2FRiwH4PzWWByw";
  const audience = "https://dev-rutnsxpydci36ykm.us.auth0.com/api/v2/";

  const response = await axios.post(
    tokenUrl,
    {
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      grant_type: "client_credentials",
    },
    {
      headers: { "content-type": "application/json" },
    }
  );

  return response.data.access_token;
}
exports.deleteOwnAccount = async (req, res) => {
  const auth0UserId = req.params.auth0Id; // Get Auth0 ID from authenticated user
  console.log(auth0UserId);
  try {
    // Delete user from Auth0
    const token = await getAuth0ManagementApiToken();

    const options = {
      method: "delete",
      maxBodyLength: Infinity,
      url:
        "https://dev-rutnsxpydci36ykm.us.auth0.com/api/v2/users/" + auth0UserId,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.request(options);

    if (response.status !== 204) {
      return res.status(404).json({ message: "User not found in Auth0" });
    }

    // Delete user from database
    const user = await User.findOneAndDelete({ auth0Id: auth0UserId }); // Find and delete user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    res.status(200).json({
      message: "User deleted successfully from Auth0 and database.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

exports.updateUserByAuth0Id = async (req, res) => {
  const auth0UserId = req.params.auth0Id; // Get Auth0 ID from authenticated user
  const userData = req.body; // Get user data from request body

  try {
    // Update user in Auth0
    const token = await getAuth0ManagementApiToken();

    const options = {
      method: "patch",
      maxBodyLength: Infinity,
      url:
        "https://dev-rutnsxpydci36ykm.us.auth0.com/api/v2/users/" + auth0UserId,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(userData),
    };

    const response = await axios.request(options);

    if (response.status !== 200) {
      return res.status(404).json({ message: "User not found in Auth0" });
    }

    // Update user in database
    const user = await User.findOneAndUpdate(
      { auth0Id: auth0UserId },
      userData,
      { new: true }
    ); // Find and update user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    res.status(200).json({
      message: "User updated successfully in Auth0 and database.",
      user: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

module.exports = exports;
