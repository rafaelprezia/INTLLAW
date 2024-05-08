// models/Invoice.js
const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceData: {
    type: Object,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // this field automatically deletes the doc after 30 days (2592000 seconds)
  },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
