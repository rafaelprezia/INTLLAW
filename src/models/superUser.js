const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SuperUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSuperUser: {
    type: Boolean,
    default: true,
  },
});

// Hash the password before saving the super user model
SuperUserSchema.pre("save", async function (next) {
  const SuperUser = this;
  if (SuperUser.isModified("password")) {
    SuperUser.password = await bcrypt.hash(SuperUser.password, 8);
  }
  next();
});

SuperUserSchema.statics.findByCredentials = async function (email, password) {
  const superUser = await this.findOne({ email });

  if (!superUser) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, superUser.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return superUser;
};

const SuperUser = mongoose.model("superUser", SuperUserSchema);

module.exports = SuperUser;
