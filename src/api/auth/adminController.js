// src/controllers/adminController.js
const User = require("../../models/user");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const massMailer = require("../utils/massMailer");

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

// Set up your Auth0 credentials and target URL for obtaining the access token

// Add other admin controller functions as necessary
exports.transformUserToWorker = async (req, res) => {
  const { email, adminId } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the admin by adminId to get the organization
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update the user's fields in your database
    user.isWorker = true;
    user.admin = adminId;
    user.organization = admin.organization; // Adding the organization to the user
    await user.save();

    // Get the Auth0 Management API token
    const token = await getAuth0ManagementApiToken();

    // Update user metadata in Auth0
    const auth0UserId = user.auth0Id; // Assuming this is stored in your User model
    const options = {
      method: "patch",
      url: `https://dev-rutnsxpydci36ykm.us.auth0.com/api/v2/users/${auth0UserId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        user_metadata: {
          isWorker: true,
          adminId: adminId,
          organization: admin.organization, // Adding the organization to Auth0 metadata
        },
      },
    };

    await axios.request(options);

    res.status(200).json({
      message:
        "User transformed into worker successfully, and Auth0 metadata updated",
    });
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

exports.deleteWorkerById = async (req, res) => {
  const { adminId, userId } = req.params; // Extract both adminId and userId from URL parameters

  try {
    // Verify that the worker exists and is managed by the admin
    const worker = await User.findById(userId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Ensure that both worker.admin and adminId are defined and compare them
    if (
      !worker.admin ||
      !adminId ||
      worker.admin.toString() !== adminId.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete workers that you manage",
      });
    }

    // Get the Auth0 Management API token
    const token = await getAuth0ManagementApiToken();

    // Delete user from Auth0
    const auth0UserId = worker.auth0Id;
    if (!auth0UserId) {
      console.error("Auth0 user ID is missing");
      return res.status(500).json({
        message: "Error deleting worker",
        error: "Auth0 user ID is missing",
      });
    }

    const options = {
      method: "delete",
      url: `https://dev-rutnsxpydci36ykm.us.auth0.com/api/v2/users/${auth0UserId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.request(options);
    if (response.status !== 204) {
      throw new Error("Failed to delete worker from Auth0");
    }

    // Delete worker from database
    await User.deleteOne({ _id: userId });

    res.status(200).json({
      message: "Worker deleted successfully from both Auth0 and database.",
    });
  } catch (error) {
    console.error("Error deleting worker:", error);
    res.status(500).json({
      message: "Error deleting worker",
      error: error.message,
    });
  }
};

exports.createWorkerLink = async (req, res) => {
  try {
    // Assume that req.body.workers contains an array of email addresses
    const workers = req.body.workers;
    if (!workers || !workers.length) {
      return res.status(400).json({ message: "No worker emails provided" });
    }

    // Step 1: Use the data passed from the body to create the email
    const emailBody = massMailer();

    // Step 2: Configure the transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rafafprezia@gmail.com", // replace with your email
        pass: "lgqt hvwn wdxj nsup", // replace with your password
      },
    });

    // Set up email options
    let mailOptions = {
      from: "rafafprezia@gmail.com", // replace with your email
      to: workers.join(","), // Join all emails with a comma for nodemailer
      subject: "Welcome to Our Platform",
      html: emailBody,
    };

    // Send the email to all workers
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending to:", mailOptions.to); // Log problematic emails
        res
          .status(400)
          .json({ message: "Error sending email", error: error.message });
      } else {
        res.status(201).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating admin", error: error.message });
  }
};
