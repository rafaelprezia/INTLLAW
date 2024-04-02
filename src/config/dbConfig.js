// dbConfig.js

// Encode URI components to ensure special characters do not break the URI
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

// Construct the MongoDB connection string
const mongoURI = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority&appName=${dbName}`;
module.exports = {
  mongoURI,
};

//
