// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const superUser = require("../models/superUser"); // Adjust the path to your Admin model

// Middleware to authenticate JWT tokens
exports.authenticateSuperUserJWT = (req, res, next) => {
  // Check if the route is for admin login
  if (req.originalUrl === "/root/login" && req.method === "POST") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};
// Middleware to verify if the authenticated user has an admin role
exports.authorizeSuperUser = (req, res, next) => {
  if (req.user && req.user.isSuperUser) {
    next(); // Proceed if user is an admin
  } else {
    res.sendStatus(403); // Forbidden if user is not an admin
  }
};

// Middleware for error handling of JWT validation
exports.jwtErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid token" });
  } else {
    next(err);
  }
};
