// model/user.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for the user model
const userSchema = new Schema({
  auth0Id: { type: String, required: true, unique: true },
  givenName: { type: String },
  familyName: { type: String },
  nickname: { type: String },
  name: { type: String },
  picture: { type: String },
  locale: { type: String },
  updatedAt: { type: Date },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean },
  isAdmin: { type: Boolean, default: false },
});

// Create a model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
