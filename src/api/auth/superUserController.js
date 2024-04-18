// src/controllers/SuperUserController.js
const User = require("../../models/user");
const SuperUser = require("../../models/superUser");
const Admin = require("../../models/admin");

const jwt = require("jsonwebtoken");
const axios = require("axios");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { generateSecretKey, verifyKey } = require("../utils/generateKey");
const createEmail = require("../utils/emailSetup");

exports.createSuperUser = async (req, res) => {
  const { email, password, name, secretKey } = req.body;

  // Replace 'your-secret-key' with your actual secret key
  if (
    secretKey !==
    "a3a225e4caa5a28f21ad83928e4fd1bc42af6e5857c22d1505d4f15a97ec80a467cad7a9dc7e2235766796f5b54bca9d"
  ) {
    return res
      .status(401)
      .json({ message: "Unauthorized to create superUser" });
  }

  try {
    const superUserInstance = new SuperUser({ email, password, name }); // Use a different name for the instance
    await superUserInstance.save();
    res
      .status(201)
      .json({ message: "superUser created successfully", superUserInstance });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating superUser", error: error.message });
  }
};

exports.createAdminLink = async (req, res) => {
  const { name, lastname, futureAdminMail } = req.body;

  try {
    // Step 1: Use the data passed from the body to create the email
    const emailBody = createEmail(name, lastname);

    // Step 2: Send the email to futureAdminMail
    let transporter = nodemailer.createTransport({
      service: "gmail", // replace with your email service
      auth: {
        user: "rafafprezia@gmail.com", // replace with your email
        pass: "lgqt hvwn wdxj nsup", // replace with your password
      },
    });

    let mailOptions = {
      from: "rafafprezia@gmail.com", // replace with your email
      to: futureAdminMail,
      subject: "Welcome to Our Platform",
      html: emailBody,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
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

exports.serveAdminCreationForm = (req, res) => {
  const { secretKey } = req.params;

  try {
    // Assuming verifyKey throws an error if the key is invalid
    verifyKey(secretKey);

    const formHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create Admin Account</title>
        <style>
          body { background-color: #F9F9F9; font-family: 'Arial', sans-serif; padding: 40px; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          form { background-color: #FFFFFF; padding: 40px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 300px; }
          input, button { width: 100%; padding: 10px; margin-top: 10px; border-radius: 4px; border: 1px solid #ccc; }
          button { background-color: #0057FF; color: white; font-weight: bold; border: none; cursor: pointer; }
          h1 { color: #333; text-align: center; }
        </style>
      </head>
      <body>
        <form action="http://localhost:3000/root/createAdmin/${secretKey}" method="post">
          <h1>Create Admin</h1>
          <input type="email" name="email" placeholder="Enter your email" required>
          <input type="password" name="password" placeholder="Enter your password" required>
          <button type="submit">Create Account</button>
        </form>
      </body>
      </html>
      `;

    res.status(200).send(formHTML);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid or expired secret key", error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  console.log(req.body); // To check if email and password are received
  const { email, password } = req.body;
  const { secretKey } = req.params;

  try {
    verifyKey(secretKey);

    const admin = new Admin({ email, password });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating admin", error: error.message });
  }
};

// Add a function to logIn superUser
exports.superUserLogin = async (req, res) => {
  try {
    const superUser = await SuperUser.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = jwt.sign(
      { id: superUser._id, isSuperUser: superUser.isSuperUser },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ superUser, token });
  } catch (error) {
    res.status(401).json({ message: "Login Failed", error: error.message });
  }
};