// src/models/admin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  // Add additional fields as required
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

adminSchema.statics.findByCredentials = async function (email, password) {
  const admin = await this.findOne({ email });
  if (!admin) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
