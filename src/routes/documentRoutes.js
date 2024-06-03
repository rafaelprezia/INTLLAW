// routes/legalCaseRoutes.js
const express = require("express");
const legalCaseController = require("../api/media/textController");
const superUserMiddleware = require("../middleware/superUserMiddleware");
const router = new express.Router();

router.post(
  "/legal-cases",
  //   superUserMiddleware.authenticateSuperUserJWT,
  //   superUserMiddleware.authorizeSuperUser,
  legalCaseController.createLegalCase
);
router.get(
  "/legal-cases/:id",
  // superUserMiddleware.authenticateSuperUserJWT,
  // superUserMiddleware.authorizeSuperUser,
  legalCaseController.getLegalCaseById
);
router.patch(
  "/legal-cases/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  legalCaseController.updateLegalCase
);
router.delete(
  "/legal-cases/:id",
  superUserMiddleware.authenticateSuperUserJWT,
  superUserMiddleware.authorizeSuperUser,
  legalCaseController.deleteLegalCase
);
router.get(
  "/legal-cases",
  // superUserMiddleware.authenticateSuperUserJWT,
  // superUserMiddleware.authorizeSuperUser,
  legalCaseController.getAllLegalCases
);

module.exports = router;
