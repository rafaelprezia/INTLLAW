let keys = {};

function generateSecretKey() {
  const key = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 2); // Set expiration time to two hours from now

  keys[key] = expiration;

  return {
    key,
    expiration,
  };
}

function verifyKey(key) {
  // Check if key is provided
  if (!key) {
    throw new Error("Key is required");
  }

  // Check if key is valid
  if (key.toString().length !== 6 || isNaN(key)) {
    throw new Error("Invalid key");
  }

  // Check if key exists
  if (!keys[key]) {
    throw new Error("Key does not exist");
  }

  // Check if key is expired
  if (new Date() > new Date(keys[key])) {
    throw new Error("Key is expired");
  }
}

module.exports = { generateSecretKey, verifyKey };
