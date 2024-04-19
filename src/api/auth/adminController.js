// src/controllers/adminController.js
const User = require("../../models/user");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const mongoose = require("mongoose");

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

//create a function to  get usser by ID

// Add a admin controller function to delete a user by ID

// Get a valid access token from Auth0

// Set up your Auth0 credentials and target URL for obtaining the access token

// Add other admin controller functions as necessary

exports.transformUserToWorker = async (req, res) => {
  const { userId, adminId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's isWorker field to true
    user.isWorker = true;

    user.admin = adminId;
    await user.save();

    res
      .status(200)
      .json({ message: "User transformed into worker successfully" });
  } catch (error) {
    console.error("Error transforming user into worker:", error);
    res.status(500).json({
      message: "Error transforming user into worker",
      error: error.message,
    });
  }
};

// Add a function for the admin to get all of its workers by adminId "admin": ["66112b014a6a8b1116c62ba9"]

exports.getWorkersByAdminId = async (req, res) => {
  try {
    const workers = await User.find({ admin: req.params.adminId });
    res.json(workers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching workers", error: error.message });
  }
};

// get individual worker by admin id and user id

exports.getWorkerByAdminIdAndUserId = async (req, res) => {
  const { auth0UserId } = req.params;
  console.log(auth0UserId);
  try {
    const worker = await User.findOne({
      auth0Id: auth0UserId,
    });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    // verify that this user pertains to the admin before sending the response
    if (worker.isWorker === false) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      res.json(worker);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching worker", error: error.message });
  }
};
