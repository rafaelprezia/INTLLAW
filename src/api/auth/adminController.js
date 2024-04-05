// /controllers/AdminController.js

const User = require("../../models/user"); // Adjust the path as needed

// Function to make a user an admin
exports.makeAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    // Update the user's role to 'admin'
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success message
    res.json({
      message: "User has been successfully made an admin",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error making user an admin:", error);
    res.status(500).send("An error occurred while making the user an admin.");
  }
};

exports.getUserByAuth0Id = async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("An error occurred while fetching the user.");
  }
};

exports.deleteUserByAuth0Id = async (req, res) => {
  try {
    const result = await User.deleteOne({ auth0Id: req.params.auth0Id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("An error occurred while deleting the user.");
  }
};

exports.updateUserByAuth0Id = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { auth0Id: req.params.auth0Id },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred while updating the user.");
  }
};
