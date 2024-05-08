// routes.js
const router = require("express").Router();
const stripeController = require("../api/payments/paymentGateway/stripeController.js");
const superUserMiddleware = require("../middleware/superUserMiddleware");
const {
  getPaymentData,
  redirectBasedUponSeats,
} = require("../api/payments/index.js");

// Route to get all charges

router.get(
  "/ip",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  async (req, res) => {
    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      console.log(ip);
      // Extract the token from the Authorization header
      const token = req.headers.authorization.split(" ")[1]; // Assumes the Authorization header format is "Bearer [token]"
      const paymentData = await getPaymentData(ip, token);
      const response = await redirectBasedUponSeats(paymentData, token);
      res.status(200).send(response);
    } catch (error) {
      console.error(error); // Logging the error to the console
      res.status(500).send({ error: error.message });
    }
  }
);

router.get(
  "/charges",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchAllCharges
);

router.get(
  "/invoice/:ip",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchInvoicesByIpAddress
);

router.post(
  "/store-invoice",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.storeInvoiceChargeAndLineItems
);

router.get(
  "/invoice",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchAllInvoices
);

router.get(
  "/invoice/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchInvoiceById
);

router.get(
  "/invoice-data/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchInvoiceDataById
);

module.exports = router;
