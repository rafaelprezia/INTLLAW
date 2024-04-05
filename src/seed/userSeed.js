// userSeed.js
const mongoose = require("mongoose");
const User = require("../models/user"); // Adjust the path as necessary
const crypto = require("crypto");

mongoose.connect(
  "mongodb+srv://rafaelprezia:Serafina112006@intllaw.tiinkq0.mongodb.net/?retryWrites=true&w=majority&appName=INTLLAW"
); // Your MongoDB connection string

function generateBearerToken() {
  return crypto.randomBytes(20).toString("hex");
}

const initialUsers = [
  { email: "rafael.prezia@storaged-us.com", isAdmin: true },
];

async function seedUsers() {
  for (const userDetails of initialUsers) {
    const { email, isAdmin } = userDetails;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          email,
          isAdmin,
          bearerToken: isAdmin ? generateBearerToken() : "",
        });
        await user.save();
        console.log(`User ${email} created with admin: ${isAdmin}`);
      } else {
        console.log(`User ${email} already exists.`);
      }
    } catch (error) {
      console.error(`Error creating user ${email}:`, error);
    }
  }

  // Close the Mongoose connection after seeding
  mongoose.connection.close();
}

// Run the seeding function
seedUsers();
