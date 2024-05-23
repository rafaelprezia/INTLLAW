// models/LegalCase.js
const mongoose = require("mongoose");

const LegalCaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  partiesInvolved: { type: String, required: true },
  category: { type: String },
  content: { type: String },
  tags: { type: Array },
});

module.exports = mongoose.model("LegalCase", LegalCaseSchema);
