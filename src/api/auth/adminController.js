// src/controllers/adminController.js
const User = require("../../models/user");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.createAdmin = async (req, res) => {
  const { email, password, secretKey } = req.body;

  // Replace 'your-secret-key' with your actual secret key
  if (
    secretKey !==
    "a3a225e4caa5a28f21ad83928e4fd1bc42af6e5857c22d1505d4f15a97ec80a467cad7a9dc7e2235766796f5b54bca9d"
  ) {
    return res.status(401).json({ message: "Unauthorized to create admin" });
  }

  try {
    const admin = new Admin({ email, password });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating admin", error: error.message });
  }
};
exports.adminLogin = async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ admin, token });
  } catch (error) {
    res.status(401).json({ message: "Login Failed", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

//create a function to  get usser by ID

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Add a admin controller function to delete a user by ID

// Get a valid access token from Auth0

// Set up your Auth0 credentials and target URL for obtaining the access token

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

// New delete user by ID function with connection to Auth0

// Add a admin controller function to delete a user by ID

//New function combination of the two bellow

exports.deleteUserById = async (req, res) => {
  const auth0UserId = req.params.auth0UserId;
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
// Add other admin controller functions as necessary
