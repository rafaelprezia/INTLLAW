// routes.js
const router = require("express").Router();
const stripeController = require("../api/payments/paymentGateway/stripeController.js");
const redirectController = require("../api/payments/index");
const superUserMiddleware = require("../middleware/superUserMiddleware");

// Route to get all charges
router.get(
  "/charges",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchAllCharges
);

router.get(
  "/process-last-purchase",
  redirectController.redirectBasedOnSeats,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchAllCharges
);

router.post(
  "/store-invoice",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.storeInvoiceChargeAndLineItems
);

module.exports = router;
