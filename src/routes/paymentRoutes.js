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

router.get(
  "/get-invoice",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchAllInvoices
);

router.get(
  "/get-invoice/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchInvoiceById
);

router.get(
  "/get-invoice-data/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  stripeController.fetchInvoiceDataById
);

module.exports = router;
