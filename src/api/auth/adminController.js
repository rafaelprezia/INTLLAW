// src/controllers/adminController.js
const User = require("../../models/user");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");

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
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Find and delete user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Add other admin controller functions as necessary
