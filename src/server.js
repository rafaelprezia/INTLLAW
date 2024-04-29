const mongoose = require("mongoose");
const app = require("./app");
const { mongoURI } = require("./config/dbConfig");

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(mongoURI, err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
