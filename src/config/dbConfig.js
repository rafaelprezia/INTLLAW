// dbConfig.js

require("dotenv").config();

// Encode URI components to ensure special characters do not break the URI
const dbUsername = encodeURIComponent(process.env.DB_USERNAME);
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

// Construct the MongoDB connection string
const mongoURI = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority&appName=INTLLAW`;
module.exports = {
  mongoURI,
};
