// model/user.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for the user model
const userSchema = new Schema({
  auth0Id: { type: String, required: true, unique: true },
  blocked: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  phoneVerified: { type: Boolean, default: false },
  userMetadata: { type: Object },
  appMetadata: { type: Object },
  givenName: { type: String },
  familyName: { type: String },
  name: { type: String },
  nickname: { type: String },
  picture: { type: String },
  verifyEmail: { type: Boolean, default: false },
  verifyPhoneNumber: { type: Boolean, default: false },
  password: { type: String },
  connection: { type: String },
  clientId: { type: String },
  username: { type: String },
  locale: { type: String },
  updatedAt: { type: Date },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
