// payments/index.js
const axios = require("axios");

const API_URL = "http://localhost:3000/stripe/charges";

exports.redirectBasedOnSeats = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/stripe/charges");
    const charges = response.data;

    // Process the charges as before...
  } catch (error) {
    console.error("Axios Error:", error.message);
    res.status(500).send("Server error processing the request.");
  }
};
