// src/middleware/authMiddleware.js
// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Adjust the path to your User model

// Middleware to authenticate JWT tokens
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.sendStatus(403); // Forbidden if token is invalid
      }

      try {
        // Find the user by the decoded token's email or other identifying field
        const user = await User.findOne({ email: decodedToken.email });

        // Check if the provided token matches the user's bearer token in the database
        if (user && token === user.bearerToken) {
          req.user = user; // Attach the user to the request object
          next();
        } else {
          res.sendStatus(401); // Unauthorized if tokens don't match
        }
      } catch (error) {
        console.error(error);
        res.sendStatus(500); // Server error
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized if token is not provided
  }
};

// Middleware to verify if the authenticated user has an admin role
exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin; proceed to the next middleware
  } else {
    return res.sendStatus(403); // Forbidden if user is not an admin
  }
};

// Optional: Middleware for error handling of JWT validation
exports.jwtErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(err.status).json({ message: err.message });
  }
  next(err);
};
